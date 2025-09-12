import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import WorkoutPlan, { IWorkoutPlan } from '../models/workoutPlan.model';
import WorkoutDay, { IWorkoutDay } from '../models/workoutDay.model';
import WorkoutExercise from '../models/workoutExercise.model';
import UserWorkoutSession from '../models/userWorkoutSession.model';
import { IUser } from '../models/user.model';

// This is a complex DTO (Data Transfer Object) for creating a full plan
interface FullWorkoutPlanDto {
  name: string;
  description?: string;
  trainerId: IUser['_id'];
  durationWeeks: number;
  days: {
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    name: string;
    exercises: {
      exerciseName: string;
      sets: number;
      reps: string;
      restPeriodSeconds: number;
    }[];
  }[];
}

class WorkoutService {
  /**
   * Creates a complete workout plan with all its days and exercises.
   * @param {FullWorkoutPlanDto} planData
   * @returns {Promise<IWorkoutPlan>}
   */
  public async createWorkoutPlan(planData: FullWorkoutPlanDto): Promise<IWorkoutPlan> {
    const plan = await WorkoutPlan.create({
      name: planData.name,
      description: planData.description,
      trainer: planData.trainerId,
      durationWeeks: planData.durationWeeks,
    });

    for (const dayData of planData.days) {
      const workoutDay = await WorkoutDay.create({
        plan: plan._id,
        dayOfWeek: dayData.dayOfWeek,
        name: dayData.name,
      });

      const exercises = dayData.exercises.map(ex => ({
        ...ex,
        workoutDay: workoutDay._id,
      }));
      await WorkoutExercise.insertMany(exercises);
    }

    return plan;
  }

  /**
   * Assigns a workout plan to a user.
   * @param {IWorkoutPlan['_id']} planId
   * @param {IUser['_id']} userId
   * @returns {Promise<any>}
   */
  public async assignPlanToUser(planId: IWorkoutPlan['_id'], userId: IUser['_id']) {
    const plan = await WorkoutPlan.findById(planId);
    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Workout plan not found');
    }
    // In a real app, you might want to deactivate previous plans for the user.
    const session = await UserWorkoutSession.create({
      user: userId,
      plan: planId,
    });
    return session;
  }

  /**
   * Gets the active workout session for a user.
   * @param {IUser['_id']} userId
   * @returns {Promise<any>}
   */
  public async getUserActivePlan(userId: IUser['_id']) {
    const activeSession = await UserWorkoutSession.findOne({ user: userId, isActive: true })
      .populate({
        path: 'plan',
        populate: {
          path: 'trainer',
          select: 'firstName lastName',
        },
      });

    if (!activeSession) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No active workout plan found for this user');
    }
    return activeSession;
  }
}

export default new WorkoutService();
