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

    price: {
        type: Number, 
        required: true, 
    },

    productpic: {
        type: String
    },

    variations: {
        type: Schema.Types.ObjectId,
        ref: 'Variation'
    },

    isShown: {
        type: Boolean,
        default: true,
    },

    description:{
        type: String,
    },

    isDiscounted:{
        type: Boolean,
        default: false,
    },

    discountType: {
        type: String,
        default: 'None'
    },

    discountValue: {
        type: Number,
        default: 0
    },

});

export const Product = mongoose.model('Product', productSchema);