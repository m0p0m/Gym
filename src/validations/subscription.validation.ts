import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const createPlan = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0).required(),
    durationDays: Joi.number().integer().min(1).required(),
  }),
};

const assignSubscription = {
  body: Joi.object().keys({
    userId: objectId.required(),
    planId: objectId.required(),
  }),
};

export default {
  createPlan,
  assignSubscription,
};
