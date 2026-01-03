import AppError from '../utils/AppError';

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles adalah array, contoh: ['admin', 'manager']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};