import mongoose from 'mongoose';

const bundleSchema = new mongoose.Schema({
    name:{
        type: String,
    },

    description:{
        type: String,
    },

    price:{
        type: Number,
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    
});

export const cBundles = mongoose.model('bundles', bundleSchema);