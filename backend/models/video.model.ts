import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    link: {
        type:String,
        required:true,
        unique:true,
    },
    thumbnail: {
        type:String,
        required:true
    },
    likes: {
        type: [{
            id:{
                type:String//mongoose.Types.ObjectId
            },
            liked:{
                type:Boolean
            }
        }],
    },
    views:{
        type:Number,
        default:0
    },
    description: {
        type:String,
        required:false,
        default:""  
    },
    channel:{
        type: {
            id:{
                type:mongoose.Types.ObjectId,
                required:true
            },
            name: {
                type:String,
                required:true
            },
            avatar: {
                type:String,
                required:true
            },
        },
        required:true
    },
    reviews:{
        type: [{
            id:{
                type:mongoose.Types.ObjectId,
                required:true
            },
            name: {
                type:String,
                required:true
            },
            description: {
                type:String,
                required:true
            },
            profileImage: {
                type:String,
            },
            publishedAt:{
                type:Date,
                default:new Date()
            }
        }]
    },
    publishedAt:{
        type:Date,
        default:new Date()
    }

})

videoSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

export const Video = mongoose.model('Video', videoSchema)