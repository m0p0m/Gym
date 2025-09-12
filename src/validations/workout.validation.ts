import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const createWorkoutPlan = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    durationWeeks: Joi.number().integer().min(1).required(),
    days: Joi.array().items(
      Joi.object({
        dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
        name: Joi.string().required(),
        exercises: Joi.array().items(
          Joi.object({
            exerciseName: Joi.string().required(),
            sets: Joi.number().integer().min(1).required(),
            reps: Joi.string().required(),
            restPeriodSeconds: Joi.number().integer().min(0).required(),
          })
        ).min(1).required(),
      })
    ).min(1).required(),
  }),
};

const assignPlanToUser = {
  body: Joi.object().keys({
    planId: objectId.required(),
    userId: objectId.required(),
  }),
};

export default {
  createWorkoutPlan,
  assignPlanToUser,
};
