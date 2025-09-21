import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const createOrder = {
  body: Joi.object().keys({
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
    }).required(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: objectId.required(),
  }),
};

export default {
  createOrder,
  getOrder,
};
