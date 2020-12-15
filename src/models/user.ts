import mongoose, { mongo } from 'mongoose';


const UserSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
        
},
{collection:'credentials'});

export const User = mongoose.model('credential',UserSchema);