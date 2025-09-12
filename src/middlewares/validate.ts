import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';

const validate = (schema: { body?: Joi.ObjectSchema, query?: Joi.ObjectSchema, params?: Joi.ObjectSchema }) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = Joi.object(schema).validate({
    body: req.body,
    query: req.query,
    params: req.params,
  }, { abortEarly: false, stripUnknown: true });

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }

  Object.assign(req, value);
  return next();
};

export default validate;
