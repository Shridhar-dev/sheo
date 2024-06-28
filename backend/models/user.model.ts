import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    profileImage: {
        type:String,
        required:true,
        default:"https://res.cloudinary.com/dnwckxyyr/image/upload/b_rgb:FFFFFF/v1719059489/pgn4knhdevbig6xj1ugl.png"  
    },
    accountType:{
        type: String,
        enum : ['consumer', 'creator'],
        default: 'consumer',
        required:true
    },
    channel:{
        type:mongoose.Types.ObjectId,
        required: false,

    },
    lastLogin:{
        type:Date,
        default: Date.now()
    },
    password: {
        type:String,
        required:true,
    },
    passwordConfirmation: {
        type:String,
        required:true,
    },
    subscriptions:{
        type:[{
            id:{
                type:mongoose.Types.ObjectId,
            },
            name:{
                type:String
            },
            avatar:{
                type:String
            }
        }]
    },
    history:{
        type:[{
            id:{
                type:mongoose.Types.ObjectId,
            },
            name:{
                type:String
            },
            thumbnail:{
                type:String
            },
            date:{
                type:Date,
                default: Date.now()
            },
        }]
    },
    saved:{
        type:[{
            id:{
                type:mongoose.Types.ObjectId,
            },
            name:{
                type:String
            },
            thumbnail:{
                type:String
            },
        }]
    },
    liked: {
        type:[{
            id:{
                type:mongoose.Types.ObjectId,
            },
            name:{
                type:String
            },
            thumbnail:{
                type:String
            },
        }]
    },
    notifications: {
        type:[{
            title:{
                type:String
            },
            description:{
                type:String
            },
            image:{
                type:String
            },
            seen:{
                type:Boolean,
                default:false
            }
        }]
    }
})

export const User = mongoose.model('User', userSchema)