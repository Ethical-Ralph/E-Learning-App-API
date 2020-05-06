const { isEmpty } = require('lodash')
const Joi = require('@hapi/joi');


const registrationDataValidation = (data) => {
    let Errors = {};

    const name = Joi.string()
        .max(30)
        .required()
        .validate(data.name);

    const username = Joi.string()
        .alphanum()
        .min(4)
        .max(20)
        .required()
        .validate(data.username);

    const email = Joi.string()
        .email()
        .required()
        .validate(data.email);

    const password = Joi.object({
        passOne: Joi.string()
            .alphanum()
            .min(7)
            .required(),
        passTwo: Joi.ref('passOne')
    }).validate(data.password);


    const city = Joi.string()
        .required()
        .validate(data.city);

    const country = Joi.string()
        .required()
        .validate(data.country);

    const phone = Joi.string()
        .required()
        .validate(data.phone);


    const fieldErrName = [ name, username, email, password, city, country, phone ]
    const fieldToValidate = [ 'name', 'username', 'email', 'password', 'city', 'country', 'phone' ]
    fieldErrName.forEach((field, index) => {
        if (!isEmpty(field.error)) {
            Errors[ fieldToValidate[ index ] ] = field.error.details[ 0 ].message.split('"')[ 2 ].trimLeft()
        }
        return null
    })
    return Errors
};

const classDataValidation = (data) => {
    const err = {}
    const name = Joi.string()
        .required()
        .validate(data.name)
    const category = Joi.string()
        .required()
        .validate(data.category)
    const description = Joi.string()
        .required()
        .validate(data.description)
    const fieldErrName = [ name, category, description ]
    const fieldToValidate = [ 'name', 'category', 'description' ]
    fieldErrName.forEach((field, index) => {
        if (!isEmpty(field.error)) {
            err[ fieldToValidate[ index ] ] = field.error.details[ 0 ].message.split('"')[ 2 ].trimLeft()
        }
        return null
    })
    return err

}


const lessonDataValidation = (data) => {
    const err = {}
    const title = Joi.string()
        .required()
        .validate(data.title)
    const body = Joi.string()
        .required()
        .validate(data.body)
    const description = Joi.string()
        .required()
        .validate(data.description)
    const fieldErrName = [ title, body, description ]
    const fieldToValidate = [ 'title', 'body', 'description' ]
    fieldErrName.forEach((field, index) => {
        if (!isEmpty(field.error)) {
            err[ fieldToValidate[ index ] ] = field.error.details[ 0 ].message.split('"')[ 2 ].trimLeft()
        }
        return null
    })
    return err

}


module.exports = {
    registrationDataValidation,
    classDataValidation,
    lessonDataValidation
};
