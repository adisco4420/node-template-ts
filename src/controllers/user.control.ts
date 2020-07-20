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
                const tokenData = TokenService.sign(updateUser.toJSON(), '5h');
                responseObj = { status: Status.SUCCESS, data: { msg: 'User Confirmed', payload: tokenData}}
            }
            this.sendResponse(responseObj, res); 
        } catch (error) {            
            this.sendResponse({status: Status.ERROR, data: error}, res);   
        }
    }
    public async Login(req: Request, res: Response) {    
        try {        
            const user: any = await UserModel.findOne({email: req.body.email}, '+password');
            let responseObj = {status: null, data: null}; 
              if (!user) {
                responseObj = {status: Status.FAILED_VALIDATION, data: 'Invalid Credentials'}
              } else {
                  const isValidPassword =  compareSync(req.body.password, user.password)
                  if (!isValidPassword){                  
                    responseObj = {status: Status.FAILED_VALIDATION, data: 'Invalid Credentials'}
                  } else {
                     if(!user.isVerified) {
                        responseObj = {status: Status.UNPROCESSABLE_ENTRY, data: 'Account is not verified'}
                        } else {
                            const newUser = user.toJSON();
                            delete newUser['password'];
                            const token = TokenService.sign(newUser, '12h')   
                            responseObj = {status: Status.SUCCESS, data: {msg:'User Login', payload: token}}
                     }
                }
            }          
            this.sendResponse(responseObj, res);
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data:error}, res);           
        }
    }
    public async ResendEmail(req: Request, res: Response) {
        try {
            let responseObj = {status: null, data: null}; 
            const user: any = await UserModel.findOne({email: req.params.email})
            if (!user) {
                responseObj = {status: Status.NOT_FOUND, data: 'User not found'}
            } else {
                if (user.isVerified) {
                    responseObj = {status: Status.SUCCESS, data: 'You are already verified'}
                } else {
                    const token = TokenService.sign({id: user.id}, '1h');
                    EmailService.send('confirm-user', {...user.toJSON(), token, baseUrl: req.body.baseUrl});
                    responseObj = {status: Status.SUCCESS, data: 'Verification message has been sented'}
                }
            }
            this.sendResponse(responseObj, res);
          } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res);  
          }
    }
    public async Profile(req: Request, res: Response) {
        try {
            const user = await UserModel.findById((req as any).user._id, '+balance');
            if(user) {
                this.sendResponse({status: Status.SUCCESS, data: { msg: 'User Profile', data: user}}, res)
            } else {
                this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'User not found'}, res)
            }
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error} , res);
        }
    }
    public async EditProfile(req: Request, res: Response) {
        try {
            const user = await UserModel.findByIdAndUpdate((req as any).user._id, {...req.body}, {new: true});
            if(user) {
                this.sendResponse({status: Status.SUCCESS, data: { msg: 'User Profile Updated Successfully', data: user}}, res)
            } else {
                this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'User not found'}, res)
            }
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error} , res);
        }
    }   
}
export default new UserController