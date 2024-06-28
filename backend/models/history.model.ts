import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required: true,
    },
    date:{
        type:String,
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
        }]
    }
})

export const History = mongoose.model('History', historySchema)