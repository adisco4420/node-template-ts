import { NextFunction, Request, Response, Router } from "express";
import UserController from '../controllers/user.control';
import Joi from '../middlewares/validator.midware';
import UserVtor from '../validations/user.validator'
import AuthMidWare from '../middlewares/auth.midware';

class UserRoute  {
    constructor() {}
    public loadRoutes(prefix: String, router: Router) {
        this.initRegister(prefix, router);
        this.initConfirm(prefix, router);
        this.initLogin(prefix, router);
        this.initResendEmail(prefix, router);
        this.initProfile(prefix, router);
        this.initEditProfile(prefix, router);
    }
    private initRegister(prefix: String, router: Router): any { 
        router.post(prefix + "/register", Joi.vdtor(UserVtor.Register), (req: Request, res: Response) => {
        UserController.Register(req, res)
        })
    } 
    private initConfirm(prefix: String, router: Router): any { 
        router.get(prefix + "/confirm-email", AuthMidWare, (req, res: Response) => {
          UserController.Confirm(req, res)
        })
    }
    private initResendEmail(prefix: String, router: Router): any { 
        router.get(prefix + "/resend-email/:email", (req, res: Response) => {            
          UserController.ResendEmail(req, res)
        })
    }
    private initLogin(prefix: String, router: Router): any { 
        router.post(prefix + "/login", Joi.vdtor(UserVtor.Login), (req, res: Response) => {
          UserController.Login(req, res)
        })
    }
    private initProfile(prefix: String, router: Router): any { 
        router.get(prefix + "/profile", AuthMidWare, (req, res: Response) => {
          UserController.Profile(req, res)
        })
    }
    private initEditProfile(prefix: String, router: Router): any { 
      router.post(prefix + "/edit-profile", Joi.vdtor(UserVtor.EditProfile), AuthMidWare, (req, res: Response) => {
        UserController.EditProfile(req, res)
      })
  }
}
export default new UserRoute;