import * as mongoose from "mongoose";

export let SampleSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

const SampleModel = mongoose.model('sample', SampleSchema)
export default SampleModel