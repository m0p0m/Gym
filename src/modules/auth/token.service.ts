import jwt from 'jsonwebtoken';
import config from '../../config';
import { IUser } from '../user/user.model';

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
    expiresIn: string,
    type: string,
    secret: string = config.jwtSecret
  ): string {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      type,
    };
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Generate auth tokens (access and refresh)
   */
  async generateAuthTokens(user: IUser) {
    const accessTokenExpires = '30m';
    const refreshTokenExpires = '30d';

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
