import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const addItem = {
  body: Joi.object().keys({
    productId: objectId.required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
};

export default {
  addItem,
};
