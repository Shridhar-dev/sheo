import mongoose from 'mongoose';
const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    avatar: {
        type: String,
        required: true,
    },
    videoList: {
        type: [mongoose.Types.ObjectId],
        required: false,
        default: []
    },
    subscribers: {
        type: [{
                id: {
                    type: mongoose.Types.ObjectId,
                },
                subscribedAt: {
                    type: Date,
                    default: Date.now()
                },
            }]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});
export const Channel = mongoose.model('Channel', channelSchema);
