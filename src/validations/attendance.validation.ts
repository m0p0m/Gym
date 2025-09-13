import Joi from 'joi';

const checkIn = {
  body: Joi.object().keys({
    // Using phoneNumber as the identifier for this example
    userIdentifier: Joi.string().required(),
  }),
};

const checkOut = {
  body: Joi.object().keys({
    userIdentifier: Joi.string().required(),
  }),
};

export default {
  checkIn,
  checkOut,
};
