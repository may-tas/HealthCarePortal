import { db } from '../config/firebase.js';
import { AuditLog } from '../types/index.js';

export const createAuditLog = async (logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> => {
  try {
    await db().collection('audit_logs').add({
      ...logData,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};
