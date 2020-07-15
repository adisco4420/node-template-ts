import * as jwt from 'jsonwebtoken';
import env from '../env';

class TokenService {
    sign(payload, expiresIn: string | number) {
       return jwt.sign(payload, env.JWT_KEY, {expiresIn: expiresIn ? expiresIn : '1d'});
    }
    verify(token: string): any {
        return jwt.verify(token, env.JWT_KEY);
    }
}
export default new TokenService;