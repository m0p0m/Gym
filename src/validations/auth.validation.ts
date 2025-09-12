import Joi from 'joi';

const sendOtp = {
  body: Joi.object().keys({
    // Basic validation for an 11-digit Iranian phone number
    phoneNumber: Joi.string().required().pattern(/^09[0-9]{9}$/),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required().pattern(/^09[0-9]{9}$/),
    otp: Joi.string().required().length(4),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};


export default {
  sendOtp,
  verifyOtp,
  refreshToken,
};
