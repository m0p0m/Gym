import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';

// This function recursively checks an object for keys containing '$' or '.'
const hasInvalidKeys = (obj: any): boolean => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  // Use an iterative approach to avoid stack overflow on deep objects
  const stack = [obj];

  while (stack.length > 0) {
    const current = stack.pop();

    if (current === null || typeof current !== 'object') {
      continue;
    }

    for (const key in current) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        if (key.includes('$') || key.includes('.')) {
          return true; // Found a prohibited key
        }
        // If the value is an object, add it to the stack to check its keys
        if (typeof current[key] === 'object') {
          stack.push(current[key]);
        }
      }
    }
  }

  return false;
};

const customMongoSanitize = (req: Request, res: Response, next: NextFunction) => {
  // Create shallow, plain copies of the request objects.
  // This is the crucial step to avoid interacting with Express's internal,
  // special objects (like req.query) which can cause the "read-only" error.
  const bodyCopy = req.body ? { ...req.body } : undefined;
  const queryCopy = req.query ? { ...req.query } : undefined;
  const paramsCopy = req.params ? { ...req.params } : undefined;

  if (
    hasInvalidKeys(bodyCopy) ||
    hasInvalidKeys(queryCopy) ||
    hasInvalidKeys(paramsCopy)
  ) {
    // If invalid keys are found, reject the request
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid characters in request data'));
  }

  // If everything is clean, proceed to the next middleware
  next();
};

export default customMongoSanitize;