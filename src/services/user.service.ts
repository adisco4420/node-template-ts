import { Response, Request } from 'express';
import { RootService, Status } from "./_root.service";
import UserControl from '../controllers/user.control';
import TokenUtil from '../utilities/token.util';
import * as bcrypt from 'bcrypt';

class UserService extends RootService {
    private bcrptSalt = 10
    createUser = async (req: Request, res: Response) => {
        try {
            const userIsUnique = await UserControl.unique({key: 'email', value: req.body.email});
            req.body.password = await bcrypt.hash(req.body.password, this.bcrptSalt);
            if(userIsUnique) {
                console.log(req.body);
                const user: any = await UserControl.create({...req.body});                
                const msg = 'Your registration is successful, kindly verify your email address';
                const regToken = TokenUtil.sign(user.toJSON(), '7d');           
                let responseObj = {status: Status.SUCCESS, data: {msg, payload: regToken}};
                this.sendResponse(responseObj, res);
                // const token = TokenService.sign({id: user._id}, '1d'); 
                // EmailService.send('confirm-user', {...user.toJSON(), token, baseUrl: req.get('origin')})
            } else {
                const msg = `This email already exists (${req.body.email})`;
                this.sendResponse({status: Status.FAILED_VALIDATION, msg, data: null}, res);
            }
        } catch (error) {
            console.log(error);
            this.sendResponse({status: Status.ERROR, data: error}, res);
        }
    }
    loginUser = async (req: Request, res: Response) => {
        try {  
            const user: any = await UserControl.getOne({email: req.body.email}, '+password');
            let responseObj = {status: null, data: null, msg: ''}; 
              if (!user) {
                responseObj = {status: Status.FAILED_VALIDATION, msg: 'Your email or password is incorrect', data: null}
              } else {
                  const isValidPassword = await bcrypt.compare(req.body.password, user.password)
                  if (!isValidPassword){                  
                    responseObj = {status: Status.FAILED_VALIDATION, msg: 'Your email or password is incorrect', data: null}
                  } else {
                    const newUser = user.toJSON();
                    delete newUser['password'];
                    const token = TokenUtil.sign(newUser, '7d');   
                    responseObj = {status: Status.SUCCESS, data: {payload: token}, msg:'User Login'}
                } 
            }          
            this.sendResponse(responseObj, res);
        } catch (error) {
            this.sendResponse({status: Status.FAILED_VALIDATION, data: error}, res);
        }
    } 
    getUserProfile = async (req: Request, res: Response) => {
        try {
            const user = await UserControl.getById((req as any).user._id);
            if(user) {
                this.sendResponse({status: Status.SUCCESS, data: { msg: 'User Profile', payload: user}}, res)
            } else {
                this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'User not found'}, res)
            } 
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error} , res);
        }
    }
    changePwd = async (req: Request, res: Response) => {
       try {
        const { oldPassword, newPassword, securityAnswer, securityQuestion } = req.body;
        if(!(oldPassword && newPassword && securityAnswer && securityQuestion)) throw 'Invalid data sent';

        const userDetails = await UserControl.getById((req as any).user._id);
        if(!userDetails) throw 'Invalid User';

        const user = userDetails.toJSON();
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if(!isValidPassword) throw 'Old password is incorrect';

        const validAnser = securityAnswer === user.otherInfo.securityQuestionAnswer;
        const validQuestion = securityQuestion === user.otherInfo.securityQuestion;
        if(!(validAnser && validQuestion)) throw 'Invalid Security question or Answer';

        const newPasswordHash = await bcrypt.hash(newPassword, this.bcrptSalt);

        await UserControl.updateById(user._id, {password: newPasswordHash})
        
        this.sendResponse({status: Status.SUCCESS, data: {payload: user}, msg: 'Password Updated Successfully'}, res)
       } catch (error) {
           const errMsg = error.msg || error;
         this.sendResponse({status: Status.ERROR, data: error, msg: errMsg} , res);
       }
    }
    getAllUsers = async (req: Request, res: Response) => {
        try {
            const sort = JSON.stringify({key: '_id', value: '-1'})
            const users = await UserControl.getAll({sort});
            this.sendResponse({status: Status.SUCCESS, data: { msg: 'All Users', payload: users}}, res)
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error} , res);
        }
    }
    adminUpdateUser = async (req: Request, res: Response) => {
        try {
            const { userId, balance } = req.body;
            if(!(userId && balance)) throw 'userId and balance are required';

            const updatedUser = await UserControl.updateById(userId, {balance});
            if(updatedUser) {
                this.sendResponse({status: Status.SUCCESS, data: { msg: 'User Updated', payload: updatedUser}}, res)
            } else {
                this.sendResponse({status: Status.UNPROCESSABLE_ENTRY, data: 'User not found'}, res)
            } 
        } catch (error) { 
            this.sendResponse({status: Status.ERROR, data: error} , res);
        }
    }
}
export default new UserService;