import { Request, Response } from 'express';
import { db } from '../config/firebase.js';
import { createAuditLog } from '../services/auditLog.js';

// Get list of assigned patients
export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    // Get all profiles where assignedProvider matches the provider's uid
    const profilesSnapshot = await db()
      .collection('profiles')
      .where('assignedProvider', '==', req.user.uid)
      .get();

    const patients = await Promise.all(
      profilesSnapshot.docs.map(async doc => {
        const profileData = doc.data();
        const userId = doc.id;

        // Get user data
        const userDoc = await db().collection('users').doc(userId).get();
        const userData = userDoc.data();

        // Get today's goal completion status
        const today = new Date().toISOString().split('T')[0];
        const goalsSnapshot = await db()
          .collection('goals')
          .where('userId', '==', userId)
          .where('date', '==', today)
          .get();

        const goals = goalsSnapshot.docs.map(doc => doc.data());
        const completedGoals = goals.filter(g => g.completed).length;
        const totalGoals = goals.length;

        // Get upcoming reminders
        const remindersSnapshot = await db()
          .collection('reminders')
          .where('userId', '==', userId)
          .where('status', '==', 'upcoming')
          .orderBy('dueDate', 'asc')
          .limit(1)
          .get();

        const upcomingReminder = remindersSnapshot.docs[0]?.data();

        return {
          id: userId,
          email: userData?.email,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          goalsStatus: {
            completed: completedGoals,
            total: totalGoals,
            percentage: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
          },
          upcomingReminder: upcomingReminder
            ? {
                title: upcomingReminder.title,
                dueDate: upcomingReminder.dueDate,
              }
            : null,
        };
      })
    );

    res.status(200).json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch patients' } });
  }
};

// Get patient details and compliance
export const getPatientDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const { id } = req.params;

    // Get profile
    const profileDoc = await db().collection('profiles').doc(id).get();

    if (!profileDoc.exists) {
      res.status(404).json({ error: { message: 'Patient not found' } });
      return;
    }

    const profileData = profileDoc.data();

    // Verify this provider is assigned to this patient
    if (profileData?.assignedProvider !== req.user.uid) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    // Get user data
    const userDoc = await db().collection('users').doc(id).get();
    const userData = userDoc.data();

    // Get recent goals (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const goalsSnapshot = await db()
      .collection('goals')
      .where('userId', '==', id)
      .where('date', '>=', sevenDaysAgoStr)
      .orderBy('date', 'desc')
      .get();

    const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get reminders
    const remindersSnapshot = await db()
      .collection('reminders')
      .where('userId', '==', id)
      .orderBy('dueDate', 'desc')
      .limit(10)
      .get();

    const reminders = remindersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    await createAuditLog({
      userId: req.user.uid,
      action: 'view_patient_details',
      resource: 'patient',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      patient: {
        id,
        email: userData?.email,
        ...profileData,
      },
      goals,
      reminders,
    });
  } catch (error) {
    console.error('Get patient details error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch patient details' } });
  }
};

// Get compliance overview for all patients
export const getCompliance = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    // Get all assigned patients
    const profilesSnapshot = await db()
      .collection('profiles')
      .where('assignedProvider', '==', req.user.uid)
      .get();

    const today = new Date().toISOString().split('T')[0];
    const complianceData = await Promise.all(
      profilesSnapshot.docs.map(async doc => {
        const userId = doc.id;
        const profileData = doc.data();

        // Get today's goals
        const goalsSnapshot = await db()
          .collection('goals')
          .where('userId', '==', userId)
          .where('date', '==', today)
          .get();

        const goals = goalsSnapshot.docs.map(doc => doc.data());
        const completedGoals = goals.filter(g => g.completed).length;

        // Check for missed reminders
        const missedRemindersSnapshot = await db()
          .collection('reminders')
          .where('userId', '==', userId)
          .where('status', '==', 'missed')
          .get();

        return {
          patientId: userId,
          patientName: `${profileData.firstName} ${profileData.lastName}`,
          goalsCompleted: completedGoals,
          goalsTotal: goals.length,
          missedReminders: missedRemindersSnapshot.size,
          complianceStatus: completedGoals === goals.length && goals.length > 0 ? 'compliant' : 'needs_attention',
        };
      })
    );

    res.status(200).json({ compliance: complianceData });
  } catch (error) {
    console.error('Get compliance error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch compliance data' } });
  }
};
