import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    _id:{
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    }
});

export const Author = mongoose.model('author',authorSchema);