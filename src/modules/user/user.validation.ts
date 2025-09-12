import Joi from 'joi';

const updateProfile = {
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      height: Joi.number().positive(),
      weight: Joi.number().positive(),
      gender: Joi.string().valid('male', 'female', 'other'),
      birthDate: Joi.date(),
      profilePictureUrl: Joi.string().uri(),
      goals: Joi.array().items(Joi.string()),
    })
    .min(1), // At least one field must be provided for an update
};

export default {
  updateProfile,
};
