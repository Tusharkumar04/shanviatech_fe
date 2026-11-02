const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    first_name: Joi.string().trim().required().label('First Name'),
    last_name: Joi.string().trim().allow('').label('Last Name'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().custom(password).required().label('Password'),
    role: Joi.string().valid('admin', 'employee', 'client').label('Role'),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  }),
};

module.exports = {
  register,
  login,
};
