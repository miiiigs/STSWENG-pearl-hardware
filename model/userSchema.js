import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstName: {
        type: String,
        required:true
    },

    lastName: {
        type: String,
        required: true
    },

    password: {
        type: String, 
        required:true
    },
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    
    dateCreated: {
        type: Date, 
        default: Date.now()
    },

    profilepic: {
        type: String,
        default: './images/assets/default_user.png'   
    },

    cart: {
        type: Array,
        required: false
    }


});

export const User = mongoose.model('User', userSchema);