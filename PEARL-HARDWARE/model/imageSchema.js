import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    img:
    {
        data: Buffer,
        contentType: String
    }
});

export const Image = mongoose.model('Image', imageSchema);