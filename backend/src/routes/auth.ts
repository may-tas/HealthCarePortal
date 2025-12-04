import { Request, Response } from 'express';
import { auth, db } from '../config/firebase.js';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthResponse, JWTPayload } from '../types/index.js';
import { createAuditLog } from '../services/auditLog.js';

// Register new user (PATIENT ONLY - Providers are pre-created)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, consent, firstName, lastName }: { email: string; password: string; consent: boolean; firstName: string; lastName: string } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: { message: 'Missing required fields' } });
      return;
    }

    if (!consent) {
      res.status(400).json({ error: { message: 'Consent is required' } });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: { message: 'Password must be at least 8 characters' } });
      return;
    }

    // Registration is ONLY for patients
    const role = 'patient';

    // Create user in Firebase Auth
    const userRecord = await auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Create user document in Firestore
    await db().collection('users').doc(userRecord.uid).set({
      email,
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
    });

    // Create profile document
    await db().collection('profiles').doc(userRecord.uid).set({
      userId: userRecord.uid,
      firstName,
      lastName,
      allergies: [],
      currentMedications: [],
    });

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload: JWTPayload = {
      uid: userRecord.uid,
      email,
      role,
    };

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    // Audit log
    await createAuditLog({
      userId: userRecord.uid,
      action: 'register',
      resource: 'auth',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const response: AuthResponse = {
      token,
      user: {
        uid: userRecord.uid,
        email,
        role,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ error: { message: 'Email already in use' } });
      return;
    }

    res.status(500).json({ error: { message: 'Registration failed' } });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: AuthRequest = req.body;

    if (!email || !password) {
      res.status(400).json({ error: { message: 'Email and password are required' } });
      return;
    }

    // Get user by email from Firebase Auth
    const userRecord = await auth().getUserByEmail(email);

    // Verify password (Firebase Auth handles this, but we'll get user data)
    const userDoc = await db().collection('users').doc(userRecord.uid).get();

    if (!userDoc.exists) {
      res.status(401).json({ error: { message: 'Invalid credentials' } });
      return;
    }

    const userData = userDoc.data();

    if (!userData?.isActive) {
      res.status(403).json({ error: { message: 'Account is inactive' } });
      return;
    }

    // Update last login
    await db().collection('users').doc(userRecord.uid).update({
      lastLogin: new Date(),
    });

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload: JWTPayload = {
      uid: userRecord.uid,
      email: userRecord.email!,
      role: userData.role,
    };

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    // Audit log
    await createAuditLog({
      userId: userRecord.uid,
      action: 'login',
      resource: 'auth',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const response: AuthResponse = {
      token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email!,
        role: userData.role,
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found') {
      res.status(401).json({ error: { message: 'Invalid credentials' } });
      return;
    }

    res.status(500).json({ error: { message: 'Login failed' } });
  }
};

// Verify token
export const verify = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    // Get latest user data
    const userDoc = await db().collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: { message: 'User not found' } });
      return;
    }

    const userData = userDoc.data();

    res.status(200).json({
      user: {
        uid: req.user.uid,
        email: req.user.email,
        role: userData?.role,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: { message: 'Verification failed' } });
  }
};

// Logout (client-side token removal, but we log it)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await createAuditLog({
        userId: req.user.uid,
        action: 'logout',
        resource: 'auth',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: { message: 'Logout failed' } });
  }
};
