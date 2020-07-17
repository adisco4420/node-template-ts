import { BaseControl, Status } from './base.control';
import { NextFunction, Request, Response } from "express";
import { compareSync, hashSync } from 'bcrypt-nodejs';
import UserModel from '../models/user.model';
import TokenService from '../services/token.service'
import ModelHelper from '../helpers/model.helper';
import EmailService from '../services/email.service';

class UserController extends BaseControl {
    public async Register(req: Request, res: Response) {
        try {       
            req.body.password = hashSync(req.body.password)
            const isUnique = await ModelHelper.unique(UserModel, {key: 'email', value: req.body.email});
            if(isUnique) {
                const user: any = await UserModel.create({...req.body});
                const msg = 'Your registration is successful, kindly verify your email address'
                let responseObj = {status: Status.SUCCESS, data: msg};
                const token = TokenService.sign({id: user._id}, '5h');                
                EmailService.send('confirm-user', {...user.toJSON(), token, baseUrl: req.body.baseUrl})
                this.sendResponse(responseObj, res);
            } else { 
                const msg = `This email already exists (${req.body.email})`
                this.sendResponse({status: Status.FAILED_VALIDATION, data: msg}, res);
            }
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res);          
        }
    } 

    public async Confirm(req: Request, res: Response) { 
        try {
            const updateUser = await UserModel.findByIdAndUpdate((req as any).user.id, {isVerified: true}, { new: true});
            let responseObj = {status: null, data: null};            
            if(!updateUser) {
                responseObj = { status: Status.UNPROCESSABLE_ENTRY, data: { msg: 'User not found'}}
            } else {
                const tokenData = TokenService.sign(updateUser.toJSON(), '12h');
                responseObj = { status: Status.SUCCESS, data: { msg: 'User Confirmed', payload: tokenData}}
            }
            this.sendResponse(responseObj, res); 
        } catch (error) {            
            this.sendResponse({status: Status.ERROR, data: error}, res);   
        }
    }
    // public async Login(req: Request, res: Response, next: NextFunction) {    
    //     try {        
    //         const user: any = await UserModel.findOne({email: req.body.email}, '+password');
    //         let responseObj = null
    //           if (!user) {
    //              responseObj = new BasicResponse(Status.FAILED_VALIDATION, {msg:'Invalid Credentials'});
    //           } else {
    //               const isValidPassword =  compareSync(req.body.password, user.password)
    //               if (!isValidPassword){                  
    //                  responseObj = new BasicResponse(Status.FAILED_VALIDATION, {msg:'Invalid Credentials'});
    //               } else {
    //                  if(!user.isVerified) {
    //                      responseObj = new BasicResponse(Status.UNPROCESSABLE_ENTRY, {msg:'Account is not verified'});
    //                     } else {
    //                         const newUser = user.toJSON();
    //                         delete newUser['password'];
    //                         const token = TokenService.sign(newUser, '12h')   
    //                         responseObj = new BasicResponse(Status.SUCCESS, {msg:'User Login', data: token});
    //                  }
    //             }
    //         }          
    //         this.sendResponse(responseObj, req, res);
    //     } catch (error) {
    //         this.sendResponse(new BasicResponse(Status.ERROR, error), req, res);           
    //     }
    // }
}
export default new UserController