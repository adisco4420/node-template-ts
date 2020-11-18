import { Router } from "express";
import SampleService from '../services/sample.service';
import Joi from '../middlewares/validator.midware';
import SampleValidator from '../validations/sample.validator';

class SampleRoute {
    public loadRoutes(prefix: String, router: Router) {
        this.create(prefix, router);
    }       
    private create(prefix: String, router: Router) {
        router.post(`${prefix}`, Joi.vdtor(SampleValidator.create), SampleService.create)
    }
} 
export default new SampleRoute;