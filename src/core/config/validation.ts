import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'develop', 'staging', 'uat', 'production', 'test')
    .default('develop'),
  APP_HOST: Joi.string().default('localhsot'),
  APP_PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().required(),
});
