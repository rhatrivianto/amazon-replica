import Joi from 'joi';

export const createOrderSchema = Joi.object({
  orderItems: Joi.array().items(Joi.object({
    product: Joi.string().hex().length(24).required(),
    qty: Joi.number().integer().min(1).required()
  })).min(1).required(),
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required()
  }).required(),
  paymentMethod: Joi.string().valid('Stripe', 'PayPal', 'Midtrans').required()
});