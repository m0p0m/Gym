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

      medicalInfo: Joi.object({
        conditions: Joi.array().items(Joi.string()),
        allergies: Joi.array().items(Joi.string()),
        notes: Joi.string().allow(''), // Allow empty string
      }),

      emergencyContact: Joi.object({
        name: Joi.string(),
        relationship: Joi.string(),
        phoneNumber: Joi.string().pattern(/^[0-9]+$/),
      }),

      bodyMeasurements: Joi.object({
        bodyFatPercentage: Joi.number().min(0).max(100),
        neck: Joi.number().positive(),
        chest: Joi.number().positive(),
        waist: Joi.number().positive(),
        hips: Joi.number().positive(),
      }),
    })
    .min(1), // At least one field must be provided for an update
};

export default {
  updateProfile,
};
