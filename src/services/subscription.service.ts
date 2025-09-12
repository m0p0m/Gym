import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import SubscriptionPlan, { ISubscriptionPlan } from '../models/subscriptionPlan.model';
import Subscription from '../models/subscription.model';
import User, { IUser } from '../models/user.model';

class SubscriptionService {
  /**
   * Create a new subscription plan
   * @param {Partial<ISubscriptionPlan>} planData
   * @returns {Promise<ISubscriptionPlan>}
   */
  public async createSubscriptionPlan(planData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
    if (await SubscriptionPlan.findOne({ name: planData.name })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Plan name already taken');
    }
    return SubscriptionPlan.create(planData);
  }

  /**
   * Assign a subscription to a user
   * @param {IUser['_id']} userId
   * @param {ISubscriptionPlan['_id']} planId
   * @returns {Promise<any>}
   */
  public async assignSubscriptionToUser(userId: IUser['_id'], planId: ISubscriptionPlan['_id']) {
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Subscription plan not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Deactivate previous active subscriptions
    await Subscription.updateMany({ user: userId, status: 'active' }, { status: 'expired' });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      startDate,
      endDate,
      status: 'active',
    });

    user.subscriptions.push(subscription._id);
    await user.save();

    return subscription;
  }

  /**
   * Get a user's active subscription
   * @param {IUser['_id']} userId
   * @returns {Promise<any>}
   */
  public async getUserSubscription(userId: IUser['_id']) {
    const subscription = await Subscription.findOne({ user: userId, status: 'active' })
      .populate('plan');

    if (!subscription) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No active subscription found for this user');
    }
    return subscription;
  }
}

export default new SubscriptionService();
