import jwt from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../database/models/user.model';

const generateAuthToken = (userId: IUser['_id']): string => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  // Token expires in 7 days
  const expiresIn = '7d';

  return jwt.sign(payload, config.jwtSecret, { expiresIn });
};

export default {
  generateAuthToken,
};
