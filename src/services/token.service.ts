import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../models/user.model';

export const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

class TokenService {
  /**
   * Generate a token
   */
  generateToken(
    userId: IUser['_id'],
    expiresIn: number, // Changed to number (seconds)
    type: string,
    secret: string = config.jwtSecret
  ): string {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      type,
    };
    const signOptions: SignOptions = {
      expiresIn,
      algorithm: 'HS256',
    };
    return jwt.sign(payload, secret, signOptions);
  }

  /**
   * Generate auth tokens (access and refresh)
   */
  async generateAuthTokens(user: IUser) {
    const accessTokenExpires = 30 * 60; // 30 minutes in seconds
    const refreshTokenExpires = 30 * 24 * 60 * 60; // 30 days in seconds

    const accessToken = this.generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);
    const refreshToken = this.generateToken(user._id, refreshTokenExpires, tokenTypes.REFRESH);

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
  }

  /**
   * Verify token and return token doc
   */
  async verifyToken(token: string): Promise<jwt.JwtPayload | string> {
    const payload = jwt.verify(token, config.jwtSecret);
    return payload;
  }
}

export default new TokenService();
