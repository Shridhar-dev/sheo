var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
const uploadAvatar = (title, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield cloudinary.uploader.upload(image, { public_id: title }, function (error, result) {
            if (error)
                throw Error(error);
            else
                return result;
        });
    }
    catch (e) {
        return e;
    }
});
export const createChannel = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const { id } = req.user;
    const avatarPath = `images/channels/${req.file.filename}`;
    const { secure_url: avatar } = yield uploadAvatar(name, avatarPath);
    fs.unlink(avatarPath, (err) => { if (err)
        console.error(err); });
    try {
        const user = yield User.findById(id).exec();
        if (user === null || user === void 0 ? void 0 : user.channel) {
            res.json({
                status: 400,
                message: "User is not a creator (doesn't own a channel)"
            });
            return;
        }
        const channelObj = yield Channel.create({ name, description, avatar, userId: id });
        yield User.findByIdAndUpdate(id, { channel: channelObj._id, accountType: "creator" });
        res.json({
            status: 200,
            link: `http://localhost:3000/channel/${channelObj._id}`,
            message: "Channel created successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Channel failed to create"
        });
    }
}));
export const getChannel = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const channel = yield Channel.findById(id).exec();
        const videos = yield Video.find({ "channel.id": id }).exec();
        const views = yield getTotalViews(id);
        const comments = yield getTotalComments(id);
        const { subscriberCount, videoCount } = yield getSubscriberAndVideoCount(channel === null || channel === void 0 ? void 0 : channel.name);
        res.json({
            status: 200,
            data: Object.assign(Object.assign({}, channel === null || channel === void 0 ? void 0 : channel._doc), { views, subscriberCount, videoCount, comments, videos }),
            message: "Channel retrieved successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Channel failed to retrieve"
        });
    }
}));
// aggregations
const getSubscriberAndVideoCount = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Channel.aggregate([{ $match: { name: name } }]).exec();
    return ({
        subscriberCount: data[0].subscribers.length,
        videoCount: data[0].videoList.length,
    });
});
const getTotalViews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const aggregateQuery = [
        {
            $match: {
                "channel.id": new mongoose.Types.ObjectId(id)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ];
    const data = yield Video.aggregate(aggregateQuery).exec();
    return (data[0] ? data[0].totalViews : 0);
});
const getTotalComments = (channelId) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        {
            $match: {
                'channel.id': new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $unwind: '$reviews'
        },
        {
            $sort: {
                'reviews.publishedAt': -1
            }
        },
        {
            $group: {
                _id: '$channel.id',
                reviewCount: { $sum: 1 },
                reviews: { $push: '$reviews' }
            }
        }
    ];
    const data = yield Video.aggregate(pipeline).exec();
    return (data[0] ? data[0].comments : { reviewCount: 0, reviews: [] });
});
