import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {
        type: String, 
        unique: true,
        lowercase: true,
        required: true
    },
    balance: { type: Number, default: 0},
    phoneNumber: {type: String, required: true},
    password: {type: String, required: true},
    userId: {type: String, required: true},
    accountInfo: {type: Object},
    bankInfo: {type: Object},
    otherInfo: {type: Object}, 
})
const UserModel = mongoose.model('users', UserSchema)
export default UserModel