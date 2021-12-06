import { Router } from "express";
import Joi from '../middlewares/validator.midware';
import UserVdtor from '../validations/user.validator';
import UserSrv from '../services/user.service';
import AuthMidware from '../middlewares/auth.midware';

class UserRoute {
    loadRoutes(prefix: string, router: Router) {
        this.create(prefix, router)
        this.loginUser(prefix, router)
        this.getUserProfile(prefix, router)
    }
    private create(prefix: string, router: Router) {
        router.post(`${prefix}`, Joi.vdtor(UserVdtor.createUser), UserSrv.createUser)
    }
    private loginUser(prefix: string, router: Router) {
        router.post(`${prefix}/login`, Joi.vdtor(UserVdtor.loginUser), UserSrv.loginUser)
    }
    private getUserProfile(prefix: string, router: Router) {
        router.get(`${prefix}/profile`, AuthMidware, UserSrv.getUserProfile)
    }

}
export default new UserRoute;