import * as joi from 'joi';

class UserValidator {
    public createUser = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        phoneNumber: joi.string().required(),
        password: joi.string().required(),
        userId: joi.string().required(),
        accountInfo: joi.object(),
        bankInfo: joi.object(),
        otherInfo: joi.object()
    })
    public loginUser = joi.object({
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().required(),
    })
}
export default new UserValidator;