import TokenService from '../services/token.service';
import { BaseControl, Status } from '../controllers/base.control';

class AuthMidWare extends BaseControl {
    auth() {
        return (req, res, next) => {   
            try {
                const authHeader = req.headers.authorization;
                if(!authHeader) return this.sendResponse({status: Status.UN_AUTHORIZED, data:'Please specify authorization header'}, res);
                const token = authHeader.split(' ')[1];
                const tokenData = TokenService.verify(token);
                if(req.url.includes('/user/confirm-email') || tokenData.isVerified) {                    
                    req.user = tokenData;
                    next();
                } else {
                    return this.sendResponse({status: Status.UN_AUTHORIZED, data:'you are not authorized unverified'}, res)
                }
            } catch (error) {
                return this.sendResponse({status: Status.UN_AUTHORIZED, data:'you are not authorized'}, res)
            }
        }
    }
}
export default new AuthMidWare().auth()