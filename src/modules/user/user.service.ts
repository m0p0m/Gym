import httpStatus from 'http-status';
import User, { IUser } from './user.model';
import { ApiError } from '../../utils/ApiError';

class UserService {
  /**
   * Get user by id
   * @param {IUser['_id']} id
   * @returns {Promise<IUser>}
   */
  public async getUserById(id: IUser['_id']): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  /**
   * Update user by id
   * @param {IUser['_id']} userId
   * @param {Partial<IUser>} updateBody
   * @returns {Promise<IUser>}
   */
  public async updateUserById(userId: IUser['_id'], updateBody: Partial<IUser>): Promise<IUser> {
    const user = await this.getUserById(userId);
    Object.assign(user, updateBody);
    await user.save();
    return user;
  }
}

export default new UserService();
