import * as joi from 'joi'
import { BaseControl, Status } from '../controllers/base.control';
/**
 * Validation middleware that uses joi to validate the request body.
 * @param schema Joi schema to use to validate the request body
 */
export class Joi extends BaseControl {
  vdtor(schema) {
    return async (req, res, next) => {
      try {
            const result = await joi.validate(req.body, schema, {
              abortEarly: false,
            });
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