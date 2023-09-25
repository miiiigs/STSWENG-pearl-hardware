import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const variationSchema = new Schema({

    type: {
        type: String, 
        required:true
    },
    choices: {
        type: {String}, 
        required: true
    },

});

export const Variation = mongoose.model('Variation', variationSchema);