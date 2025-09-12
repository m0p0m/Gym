import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const createDietPlan = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    totalCalories: Joi.number().integer().min(0).required(),
    days: Joi.array().items(
      Joi.object({
        dayNumber: Joi.number().integer().min(1).required(),
        meals: Joi.array().items(
          Joi.object({
            name: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snack').required(),
            time: Joi.string().pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/).required(), // "HH:MM"
            items: Joi.array().items(
              Joi.object({
                name: Joi.string().required(),
                quantity: Joi.string().required(),
                calories: Joi.number().integer().min(0).required(),
              })
            ).min(1).required(),
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

const logAdherence = {
  body: Joi.object().keys({
    date: Joi.string().isoDate().required(), // "YYYY-MM-DD"
    followed: Joi.boolean().required(),
  }),
};

export default {
  createDietPlan,
  assignPlanToUser,
  logAdherence,
};
