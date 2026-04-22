import type { NextFunction, Request, Response } from 'express';
import { auth } from './db';

/**
 * Authorization Middleware for ARX.
 * @param permission - The required permission to access the route.
 */
export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get user identity (usually from JWT or session)
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Missing identity',
        message: 'Provide "x-user-id" header to identify the requester.',
      });
    }

    // 2. Perform the authorization check via ARX
    try {
      const isAllowed = await auth.can(userId, permission);

      if (isAllowed) {
        return next();
      }

      // 3. Deny access if not authorized
      return res.status(403).json({
        success: false,
        error: 'Access Denied',
        message: `User "${userId}" does not have the "${permission}" permission.`,
      });
    } catch (error) {
      console.error('ARX Authorization Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Authorization Error',
      });
    }
  };
};
