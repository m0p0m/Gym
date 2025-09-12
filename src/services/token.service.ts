import jwt from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../database/models/user.model';

// Define token types
export const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

/**
 * Generate a token
 * @param {IUser['_id']} userId
 * @param {string} expiresIn
 * @param {string} type
 * @param {string} secret
 * @returns {string}
 */
const generateToken = (
  userId: IUser['_id'],
  expiresIn: string,
  type: string,
  secret: string = config.jwtSecret
): string => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    type,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate auth tokens (access and refresh)
 * @param {IUser} user
 * @returns {Promise<object>}
 */
const generateAuthTokens = async (user: IUser) => {
  const accessTokenExpires = '30m'; // 30 minutes
  const refreshTokenExpires = '30d'; // 30 days

  const accessToken = generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);
  const refreshToken = generateToken(user._id, refreshTokenExpires, tokenTypes.REFRESH);

  // Here you would typically save the refresh token to the user's document in the DB
  // This logic will be in the controller/service that calls this function.

  return {
    access: {
      token: accessToken,
      expires: new Date(Date.now() + 30 * 60 * 1000),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  };
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<jwt.JwtPayload>}
 */
const verifyToken = async (token: string): Promise<jwt.JwtPayload | string> => {
    const payload = jwt.verify(token, config.jwtSecret);
    return payload;
};


export default {
  generateToken,
  verifyToken,
  generateAuthTokens,
};
