import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bundleSchema = new Schema({
    name: String,
    description: String,
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
});

export const Bundle = mongoose.model('Bundle', bundleSchema);