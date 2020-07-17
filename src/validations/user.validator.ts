import * as joi from 'joi';

class UserValidator {
    public Register = {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().required(),
        baseUrl: joi.string().required(),
    }
    public Login = {
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().required(),
    }
}
export default new UserValidator()