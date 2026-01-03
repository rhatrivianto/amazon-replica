import Joi from 'joi';

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    'number.max': 'Rating maksimal adalah 5'
  }),
  comment: Joi.string().min(5).max(500).required()
});