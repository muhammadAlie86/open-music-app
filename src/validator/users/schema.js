const Joi = require('joi');

const UserPayloadSchema = Joi.object({

    usename : Joi.string.required(),
    password : Joi.string.required(),
    fullname : Joi.string.required(),

});

module.exports =UserPayloadSchema;