import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.Number,
        required: true
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
    }
})