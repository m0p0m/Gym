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

const updateItem = {
  params: Joi.object().keys({
    itemId: objectId.required(),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const removeItem = {
  params: Joi.object().keys({
    itemId: objectId.required(),
  }),
};

export default {
  addItem,
  updateItem,
  removeItem,
};
