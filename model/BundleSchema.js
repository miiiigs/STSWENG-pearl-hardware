import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bundleSchema = new Schema({
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

export const cBundles = mongoose.model('bundles', bundleSchema);



