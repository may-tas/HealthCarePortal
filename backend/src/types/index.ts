export interface User {
  uid: string;
  email: string;
  role: 'patient' | 'provider';
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

export interface Profile {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
  allergies?: string[];
  currentMedications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  assignedProvider?: string;
}

export interface Goal {
  id?: string;
  userId: string;
  date: string;
  type: 'steps' | 'active_time' | 'sleep' | 'water';
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id?: string;
  userId: string;
  type: 'preventive_care' | 'medication' | 'appointment';
  title: string;
  description: string;
  dueDate: string;
  status: 'upcoming' | 'completed' | 'missed';
  createdBy: string;
  createdAt: Date;
}

export interface HealthTip {
  id?: string;
  title: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'mental_health' | 'general';
  isActive: boolean;
  createdAt: Date;
}

export interface AuditLog {
  id?: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
  role?: 'patient' | 'provider';
  consent?: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    uid: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  uid: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
