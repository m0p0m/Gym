import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful responses against the limit
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
