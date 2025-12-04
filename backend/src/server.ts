import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import initializeFirebase from './config/firebase.js';
import { authMiddleware } from './middleware/auth.js';
import { roleMiddleware } from './middleware/role.js';
import * as authController from './routes/auth.js';
import * as patientController from './routes/patient.js';
import * as providerController from './routes/provider.js';
import * as publicController from './routes/public.js';

dotenv.config();

// Initialize Firebase
initializeFirebase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.get('/api/health-info', publicController.getHealthInfo);

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authMiddleware, authController.logout);
app.get('/api/auth/verify', authMiddleware, authController.verify);

// Patient routes (protected, patient role only)
app.get('/api/patients/profile', authMiddleware, roleMiddleware(['patient']), patientController.getProfile);
app.put('/api/patients/profile', authMiddleware, roleMiddleware(['patient']), patientController.updateProfile);
app.get('/api/patients/dashboard', authMiddleware, roleMiddleware(['patient']), patientController.getDashboard);
app.post('/api/patients/goals', authMiddleware, roleMiddleware(['patient']), patientController.logGoal);
app.get('/api/patients/goals', authMiddleware, roleMiddleware(['patient']), patientController.getGoals);

// Provider routes (protected, provider role only)
app.get('/api/providers/patients', authMiddleware, roleMiddleware(['provider']), providerController.getPatients);
app.get('/api/providers/patients/:id', authMiddleware, roleMiddleware(['provider']), providerController.getPatientDetails);
app.get('/api/providers/compliance', authMiddleware, roleMiddleware(['provider']), providerController.getCompliance);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status((err as any).status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
