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
    },

    line1:{
        type: String,
        required: false
    },

    line2:{
        type: String,
        required: false
    },
    
    city:{
        type: String,
        required: false
    },

    state:{
        type: String,
        required: false
    },

    postalCode:{
        type: Number,
        required: false,
        validate: {
            validator: function(value) {
              // Convert the number to a string and check its length
              return value.toString().length <= 4;
            },
            message: 'Number must have at most 4 digits.',
          },
    },

    country:{
        type: String,
        required: false
    }


});

export const User = mongoose.model('User', userSchema);