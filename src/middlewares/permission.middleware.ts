import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import Role from '../models/role.model';
import { IPermission } from '../models/permission.model';

const hasPermission = (requiredPermission: string) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    try {
        // Populate the permissions for the user's role
        const userRole = await Role.findById(req.user.role).populate('permissions');

        if (!userRole) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'User role not found'));
        }

        const permissions = userRole.permissions as IPermission[];
        const hasPerm = permissions.some(p => p.name === requiredPermission);

        if (!hasPerm) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action'));
        }

        next();
    } catch (error) {
        return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error checking permissions'));
    }
};

export default hasPermission;
