import mongoose from 'mongoose';

const bundleSchema =  new mongoose.Schema({
    bname: {
        type: String,
    },
    bdescription: {
        type: String,
    },
    bprice: {
        type: Number,
    },
    bproducts:
    {
        type: mongoose.SchemaTypes.Array,
        ref: 'products',
    },
});

export const cBundles = new mongoose.model('bundles', bundleSchema);



