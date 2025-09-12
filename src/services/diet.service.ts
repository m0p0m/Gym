import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import DietPlan, { IDietPlan } from '../models/dietPlan.model';
import DietDay from '../models/dietDay.model';
import Meal from '../models/meal.model';
import FoodItem from '../models/foodItem.model';
import UserDietSession from '../models/userDietSession.model';
import { IUser } from '../models/user.model';

// DTO for creating a full diet plan
interface FullDietPlanDto {
  name: string;
  description?: string;
  creatorId: IUser['_id'];
  totalCalories: number;
  days: {
    dayNumber: number;
    meals: {
      name: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
      time: string;
      items: {
        name: string;
        quantity: string;
        calories: number;
      }[];
    }[];
  }[];
}

class DietService {
  /**
   * Creates a complete diet plan.
   * @param {FullDietPlanDto} planData
   * @returns {Promise<IDietPlan>}
   */
  public async createDietPlan(planData: FullDietPlanDto): Promise<IDietPlan> {
    const plan = await DietPlan.create({
      name: planData.name,
      description: planData.description,
      creator: planData.creatorId,
      totalCalories: planData.totalCalories,
    });

    for (const dayData of planData.days) {
      const dietDay = await DietDay.create({
        plan: plan._id,
        dayNumber: dayData.dayNumber,
      });

      for (const mealData of dayData.meals) {
        const meal = await Meal.create({
          dietDay: dietDay._id,
          name: mealData.name,
          time: mealData.time,
        });

        const foodItems = mealData.items.map(item => ({ ...item, meal: meal._id }));
        await FoodItem.insertMany(foodItems);
      }
    }
    return plan;
  }

  /**
   * Assigns a diet plan to a user.
   * @param {IDietPlan['_id']} planId
   * @param {IUser['_id']} userId
   */
  public async assignPlanToUser(planId: IDietPlan['_id'], userId: IUser['_id']) {
    const plan = await DietPlan.findById(planId);
    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Diet plan not found');
    }
    const session = await UserDietSession.create({ user: userId, plan: planId });
    return session;
  }

  /**
   * Logs a user's adherence for a specific day.
   * @param {IUser['_id']} userId
   * @param {string} date - "YYYY-MM-DD"
   * @param {boolean} followed
   */
  public async logDietAdherence(userId: IUser['_id'], date: string, followed: boolean) {
    const session = await UserDietSession.findOne({ user: userId, isActive: true });
    if (!session) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No active diet session found for this user');
    }

    // Remove any existing entry for this date
    session.adherence = session.adherence.filter(entry => entry.date !== date);
    // Add the new entry
    session.adherence.push({ date, followed });

    await session.save();
    return session;
  }
}

export default new DietService();
