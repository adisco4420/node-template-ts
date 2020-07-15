import * as joi from 'joi';

class UserValidator {
    public Register = {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        phoneNumber: joi.string().required(),
        password: joi.string().required(),
        baseUrl: joi.string().required()
    }
}
export default new UserValidator()