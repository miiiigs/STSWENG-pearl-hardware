import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({

    name: {
        type: String, 
        required:true
    },

    type: {
        type: String, 
        required: true, 
    },

    quantity: {
        type: Number, 
        required: true, 
    },

    productpic: {
        type: [String],
        default:[]   
    },

    variations: {
        type: Schema.Types.ObjectId,
        ref: 'Variation'
    },

});

export const Product = mongoose.model('Product', productSchema);