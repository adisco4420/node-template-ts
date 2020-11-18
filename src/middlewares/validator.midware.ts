import * as joi from 'joi'
import { RootService, Status } from '../services/_root.service';
/**
 * Validation middleware that uses joi to validate the request body.
 * @param schema Joi schema to use to validate the request body
 */
export class Joi extends RootService {
  vdtor(schema: joi.Schema) {
    return async (req, res, next) => {
      try {
            await schema.validateAsync(req.body, {abortEarly: false})
            next();
          } catch (err) {                          
            const errorDetails = err.details.map(e => e.message);
            const response = {
              msg: 'Some validation errors occured',
              errors: errorDetails,
            }   
           return this.sendResponse({status: Status.FAILED_VALIDATION, data: response}, res)
          }
        }; 
  }
}
const newJoi = new Joi()
export default newJoi;