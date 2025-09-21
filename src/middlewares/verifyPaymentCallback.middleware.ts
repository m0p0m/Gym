import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import httpStatus from 'http-status';
import config from '../config';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware to verify that the payment callback is from a trusted source (Zarinpal).
 * This is a simulation of how webhook verification works.
 * It assumes Zarinpal sends a signature in the 'x-zarinpal-signature' header.
 * The signature is an HMAC-SHA256 hash of the request body, using a shared secret.
 */
const verifyPaymentCallback = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.get('x-zarinpal-signature');

  if (!signature) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Missing signature header'));
  }

  try {
    if (!req.rawBody) {
      throw new Error('Raw body not available for signature verification');
    }

    const hmac = crypto.createHmac('sha256', config.zarinpalSecret);
    const computedSignature = hmac.update(req.rawBody).digest('hex');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    );

    if (!isSignatureValid) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid signature'));
    }

    next();
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error during signature verification'));
  }
};

export default verifyPaymentCallback;
