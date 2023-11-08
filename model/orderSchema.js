import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    firstName: {
        type: mongoose.SchemaTypes.String,
        required:true
    },
    lastName: {
        type: mongoose.SchemaTypes.String,
        required:true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required:true
    },
    items: {
        type: mongoose.SchemaTypes.Array,
        required: true
    },
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    status:{
        type: mongoose.SchemaTypes.String,
        required: true
    },
    amount: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    paymongoID: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
})

export const Order = mongoose.model('Order', orderSchema);