import Joi from 'joi';

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required().pattern(/^[0-9]{11}$/), // Basic validation for an 11-digit phone number
    password: Joi.string().required().min(8),
  }),
};

const login = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default {
  register,
  login,
};
