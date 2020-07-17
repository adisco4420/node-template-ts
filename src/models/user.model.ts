
import * as mongoose from "mongoose";

export let UserSchema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String},
    phoneNumber: { type: String},
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
    balance: {
        type: Number,
        default: 0
    }
});

const UserModel = mongoose.model('users', UserSchema)
export default UserModel