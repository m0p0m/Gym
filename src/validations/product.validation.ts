import Joi from 'joi';
import { Types } from 'mongoose';

const objectId = Joi.string().custom((value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Mongo ID');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    stockQuantity: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()),
    brand: Joi.string(),
    category: Joi.string().required(),
    isAvailable: Joi.boolean(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    search: Joi.string(),
    category: Joi.string(),
    brand: Joi.string(),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: objectId.required(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: objectId.required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      stockQuantity: Joi.number().integer().min(0),
      images: Joi.array().items(Joi.string().uri()),
      brand: Joi.string(),
      category: Joi.string(),
      isAvailable: Joi.boolean(),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: objectId.required(),
  }),
};

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
