
import * as mongoose from "mongoose";

export let UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
        },
    lastName: {
        type: String,
        required: true
        },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        },
    password: {
        type: String,
        required: true,
        select: false
        },
    phoneNumber: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    isAdmin: {
        type: Boolean, 
        default: false
    },
    createdAt: { 
        type: Date,
        default: new Date()
    },
});

const UserModel = mongoose.model('users', UserSchema)
export default UserModel