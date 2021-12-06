import { Response } from "express";
import { winston } from '../utilities/logger.util'
export enum Status {
    SUCCESS,
    CREATED,
    FAILED_VALIDATION,
    UN_AUTHORIZED,
    ERROR,
    PROCESSING,
    NOT_FOUND,
    PRECONDITION_FAILED,
    SUCCESS_NO_CONTENT, 
    FORBIDDEN,
    UNPROCESSABLE_ENTRY
}

export class RootService {

    public sendResponse(serviceResponse: {status: Status , data?: any, message?: string}, res: Response): any {        
        const response = {
            status: this.getStatusString(serviceResponse.status),
            data: serviceResponse.data,
            message: serviceResponse.message
        }
        const status_code = this.getHttpStatus(response.status);
        if(status_code >= 400) {
            winston.error(`[App Error] ${response.message}`)
        }
        console.log('responding with', response.status);
        res.status(status_code).json(response);
    }
    private getHttpStatus(status: any): number {
        switch (status) {
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'SUCCESS_NO_CONTENT':
                return 204;
            case 'FAILED_VALIDATION':
                return 400;
            case 'UN_AUTHORIZED':
                return 401;
            case 'FORBIDDEN':
                return 403;
            case 'NOT_FOUND':
                return 404;
            case 'CONFLICT':
                return 409;
            case 'UNPROCESSABLE_ENTRY':
                return 422;
            case 'UNATHORIZED':
                return 401;
            case 'PRECONDITION_FAILED':
                return 412;
            default:
                return 500;
        }
    }
    public getStatusString(status) {              
        return Status[status];
    }
}