import { BaseControl, Status } from './base.control';
import { NextFunction, Request, Response } from "express";
import { compareSync, hashSync } from 'bcrypt-nodejs';
import UserModel from '../models/user.model';
import TokenService from '../services/token.service'
import ModelHelper from '../helpers/model.helper';

class UserController extends BaseControl {
    public async Register(req: Request, res: Response, next: NextFunction) {
        try {       
            req.body.password = hashSync(req.body.password)
            const isUnique = await ModelHelper.unique(UserModel, {key: 'email', value: req.body.email});
            if(isUnique) {
                const user: any = await UserModel.create({...req.body});
                const msg = 'Your registration is successful, kindly verify your email address'
                let responseObj = {status: Status.SUCCESS, data: msg};
                const token = TokenService.sign({id: user._id}, '5h');                
                // EmailService.send('confirm', {...user.toJSON(), token, baseUrl: req.body.baseUrl})
                this.sendResponse(responseObj, res);
            } else { 
                const msg = `This email already exists (${req.body.email})`
                this.sendResponse({status: Status.FAILED_VALIDATION, data: msg}, res);
            }
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res);          
        }
    } 
}
export default new UserController