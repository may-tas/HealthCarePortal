import { Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { createAuditLog } from '../services/auditLog.js';

// Get patient profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const profileDoc = await db().collection('profiles').doc(req.user.uid).get();

    if (!profileDoc.exists) {
      res.status(404).json({ error: { message: 'Profile not found' } });
      return;
    }

    await createAuditLog({
      userId: req.user.uid,
      action: 'view_profile',
      resource: 'profile',
      resourceId: req.user.uid,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json(profileDoc.data());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch profile' } });
  }
};

// Update patient profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const { firstName, lastName, dateOfBirth, phone, allergies, currentMedications, emergencyContact } = req.body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (phone) updateData.phone = phone;
    if (allergies) updateData.allergies = allergies;
    if (currentMedications) updateData.currentMedications = currentMedications;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;

    await db().collection('profiles').doc(req.user.uid).update(updateData);

    await createAuditLog({
      userId: req.user.uid,
      action: 'update_profile',
      resource: 'profile',
      resourceId: req.user.uid,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: { message: 'Failed to update profile' } });
  }
};

// Get patient dashboard data
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    // Get today's goals
    const goalsSnapshot = await db()
      .collection('goals')
      .where('userId', '==', req.user.uid)
      .where('date', '==', today)
      .get();

    const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get upcoming reminders
    const remindersSnapshot = await db()
      .collection('reminders')
      .where('userId', '==', req.user.uid)
      .where('status', '==', 'upcoming')
      .orderBy('dueDate', 'asc')
      .limit(5)
      .get();

    const reminders = remindersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get random health tip
    const tipsSnapshot = await db()
      .collection('health_tips')
      .where('isActive', '==', true)
      .limit(10)
      .get();

    const tips = tipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const randomTip = tips.length > 0 ? tips[Math.floor(Math.random() * tips.length)] : null;

    res.status(200).json({
      goals,
      reminders,
      healthTip: randomTip,
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch dashboard data' } });
  }
};

// Log goal entry
export const logGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const { type, target, current, unit, date } = req.body;

    if (!type || target === undefined || current === undefined || !unit) {
      res.status(400).json({ error: { message: 'Missing required fields' } });
      return;
    }

    const goalDate = date || new Date().toISOString().split('T')[0];
    const completed = current >= target;

    const goalData = {
      userId: req.user.uid,
      date: goalDate,
      type,
      target,
      current,
      unit,
      completed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const goalRef = await db().collection('goals').add(goalData);

    await createAuditLog({
      userId: req.user.uid,
      action: 'log_goal',
      resource: 'goal',
      resourceId: goalRef.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({ id: goalRef.id, ...goalData });
  } catch (error) {
    console.error('Log goal error:', error);
    res.status(500).json({ error: { message: 'Failed to log goal' } });
  }
};

// Get goal history
export const getGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const { startDate, endDate, type } = req.query;

    let query = db().collection('goals').where('userId', '==', req.user.uid);

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }
    if (endDate) {
      query = query.where('date', '<=', endDate);
    }
    if (type) {
      query = query.where('type', '==', type);
    }

    const goalsSnapshot = await query.orderBy('date', 'desc').limit(30).get();

    const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch goals' } });
  }
};
