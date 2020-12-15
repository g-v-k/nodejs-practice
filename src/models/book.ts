import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    _id:{
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    authorID:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    }
});

export const Book = mongoose.model('book',bookSchema);