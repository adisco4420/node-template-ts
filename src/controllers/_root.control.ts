import { Model, Document } from 'mongoose';
import QueryUtil from '../utilities/query.util';

export class RootController {
    private model: Model<Document>;
    constructor(model: Model<Document>) {
        this.model = model
    }
    unique = async (conditions: {key: string, value: string}) => {
        const {key, value} = conditions;
        const res =  await this.model.findOne({[key]: value});        
        if(res) {
            return false
        } else {
            return true;
        }
    } 
    create(payload) {
        return this.model.create({...payload})
    }
    getAll(query?: {filter?: any, limit?: number, skip?: number, sort?: any}) {
        const { filter, skip, limit, sort } = QueryUtil.buildQuery(query);
        return this.model.find({...filter}).skip(skip).limit(limit).sort(sort);
    }
    getOne(query, select = '') {
        const { filter } = QueryUtil.buildQuery(query)
        return this.model.findOne({...filter}).select(select)
    }
    getById(id, select = '') {
        return this.model.findById(id).select(select)
    }
    updateOne(query, updateValues) {
        const { filter: condition } = QueryUtil.buildQuery(query)
        return this.model.updateOne({...condition}, {...updateValues}, {new: true})
    }
    updateMany(query, updateValues) {
        const { filter: condition } = QueryUtil.buildQuery(query)
        return this.model.updateMany({...condition}, {...updateValues})
    }
    updateById(id, condition) {
        return this.model.findByIdAndUpdate(id, {...condition}, {new: true})
    }
    deleteOne(query) {
        const { filter: condition } = QueryUtil.buildQuery(query)
        return this.model.deleteOne({...condition})
    }
    deleteMany(query) {
        const { filter: condition } = QueryUtil.buildQuery(query)
        return this.model.deleteMany({...condition})
    }
    deleteById(id) {
        return this.model.findByIdAndDelete(id)
    }
}