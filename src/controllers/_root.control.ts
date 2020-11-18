import { Model, Document } from 'mongoose';
export class RootController {
    private model: Model<Document>;
    constructor(model: Model<Document>) {
        this.model = model
    }
    unique = async (conditions: object) => {
        const res =  await this.model.findOne({...conditions});        
        if(res) {
            return false
        } else {
            return true;
        }
    } 
    create(payload) {
        return this.model.create({...payload})
    }
    getAll(conditions?) {
        return this.model.find({...conditions})
    }
    update() {

    }
    delete() {

    }
}