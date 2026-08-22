import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { User, UserRole } from '../models/User';
import { mockUsers } from '../controllers/userController';

export const authorizePermission = (permission: string, ...fallbackRoles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: { code: 'AUTH_REQUIRED' },
      });
    }

    // SuperAdmin token has full unrestricted access
    if (req.user.role === 'SUPERADMIN') {
      return next();
    }

    let currentRole = req.user.role;
    let userPermissions = req.user.permissions || [];

    // Real-time lookup to reflect dynamic permission updates without requiring re-login
    if (req.user.id || req.user.email) {
      try {
        let liveUser: any = null;
        if (req.user.id) {
          liveUser = await User.findById(req.user.id);
        }
        if (!liveUser && req.user.email) {
          liveUser = mockUsers.find(
            (u) =>
              u.id === req.user?.id ||
              u._id === req.user?.id ||
              u.email.toLowerCase() === req.user?.email.toLowerCase()
          );
        }
        if (liveUser) {
          currentRole = liveUser.role || currentRole;
          userPermissions = liveUser.permissions || userPermissions;
        }
      } catch {}
    }

    if (currentRole === 'SUPERADMIN') {
      return next();
    }

    // Check if user has explicit granular permission granted
    if (
      userPermissions.includes(permission) ||
      userPermissions.includes('ALL') ||
      (permission.startsWith('CMS_') && userPermissions.includes('CMS')) ||
      (permission === 'FINANCE' && userPermissions.includes('FINANCE'))
    ) {
      return next();
    }

    // Check fallback role authorization
    if (fallbackRoles.includes(currentRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden. Access denied: missing '${permission}' permission for role '${currentRole}'.`,
      error: { code: 'PERMISSION_DENIED' },
    });
  };
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: { code: 'AUTH_REQUIRED' },
      });
    }

    let currentRole = req.user.role;

    if (req.user.id || req.user.email) {
      try {
        let liveUser: any = null;
        if (req.user.id) {
          liveUser = await User.findById(req.user.id);
        }
        if (!liveUser && req.user.email) {
          liveUser = mockUsers.find(
            (u) =>
              u.id === req.user?.id ||
              u._id === req.user?.id ||
              u.email.toLowerCase() === req.user?.email.toLowerCase()
          );
        }
        if (liveUser) {
          currentRole = liveUser.role || currentRole;
        }
      } catch {}
    }

    // SuperAdmin has full unrestricted access
    if (currentRole === 'SUPERADMIN') {
      return next();
    }

    if (allowedRoles.includes(currentRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden. Role '${currentRole}' is not authorized to access this resource.`,
      error: { code: 'PERMISSION_DENIED' },
    });
  };
};
