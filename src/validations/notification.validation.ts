import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const markAsRead = {
  params: Joi.object().keys({
    notificationId: objectId.required(),
  }),
};

export default {
  markAsRead,
};
