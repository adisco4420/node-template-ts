import { NextFunction, Request, Response, Router } from "express";
import UserController from '../controllers/user.control';
import Joi from '../middlewares/validator.midware';
import UserVtor from '../validations/user.validator'

class UserRoute  {
    constructor() {}

    public loadRoutes(prefix: String, router: Router) {
        this.initRegister(prefix, router);
    }
    private initRegister(prefix: String, router: Router): any { 
        router.post(prefix + "/register", Joi.vdtor(UserVtor.Register), (req: Request, res: Response, next: NextFunction) => {
        UserController.Register(req, res, next)
        })
    }
}
export default new UserRoute;