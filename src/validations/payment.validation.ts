import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const createOrderPayment = {
  params: Joi.object().keys({
    orderId: objectId.required(),
  }),
};

const paymentCallback = {
    query: Joi.object().keys({
        Authority: Joi.string().required(),
        Status: Joi.string().required(),
    }),
};

export default {
  createOrderPayment,
  paymentCallback,
};
