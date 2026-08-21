import { AuditLog } from '../models/AuditLog';

export const logAudit = async (
  userId: string,
  userName: string,
  role: string,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
  ipAddress?: string
) => {
  try {
    await AuditLog.create({
      user: userId,
      userName,
      role,
      action,
      entity,
      entityId,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error('[Audit Log Error]: Failed to create log:', error);
  }
};
