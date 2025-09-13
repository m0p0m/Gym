import Joi from 'joi';

const createOrder = {
  body: Joi.object().keys({
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
    }).required(),
  }),
};

export default {
  createOrder,
};
