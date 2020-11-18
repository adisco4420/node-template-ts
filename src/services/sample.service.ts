import { Response, Request } from 'express';
import SampleController from '../controllers/sample.control';
import { RootService, Status } from './_root.service';
class SampleService extends RootService {
    create = async (req: Request, res: Response) => {
        try {
            const sample = await SampleController.create(req.body);
            this.sendResponse({status: Status.SUCCESS, data: sample}, res);
        } catch (error) {
            this.sendResponse({status: Status.ERROR, data: error}, res)
        } 
    }
}
export default new SampleService;