var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Video } from "../models/video.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { asyncHandler } from "../utils/asyncHandler.js";
import { Channel } from "../models/channel.model.js";
import fs from "fs";
import { History } from "../models/history.model.js";
import { User } from "../models/user.model.js";
const uploadVideo = (title, video) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield cloudinary.uploader.upload(video, { public_id: title, resource_type: 'raw' }, function (error, result) {
            if (error) {
                console.error(error);
                throw Error(error);
            }
            else
                return result;
        });
    }
    catch (e) {
    }
});
const uploadThumbnail = (title, image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield cloudinary.uploader.upload(image, { public_id: title }, function (error, result) {
            if (error)
                throw Error(error);
            else
                return result;
        });
    }
    catch (e) {
    }
});
export const getAllVideos = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield Video.find({});
        res.json({
            status: 200,
            data: videos,
            message: "Videos fetched successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Videos failed to fetched"
        });
    }
}));
export const createVideo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const { id } = req.user;
    const thumbnailPath = `images/videos/${req.files.thumbnail[0].filename}`;
    const videoPath = `videos/${req.files.video[0].filename}`;
    const { secure_url: video } = yield uploadVideo(name, videoPath);
    const { secure_url: thumbnail } = yield uploadThumbnail(name, thumbnailPath);
    fs.unlink(videoPath, (err) => { if (err)
        console.error(err); });
    fs.unlink(thumbnailPath, (err) => { if (err)
        console.error(err); });
    try {
        const channelObj = yield Channel.find({ userId: id }).exec();
        const videoObj = yield Video.create({ name, link: video, thumbnail, description, channel: {
                id: channelObj[0]._id,
                avatar: channelObj[0].avatar,
                name: channelObj[0].name
            } });
        yield channelObj[0].updateOne({ $push: { videoList: videoObj._id } }).exec();
        yield channelObj[0].updateOne({ $push: { history: { id: videoObj._id, thumbnail, name } } }).exec();
        res.json({
            status: 200,
            link: `http://localhost:3000/video/${videoObj._id}`,
            message: "Video fetched suvessfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Video failed to fetch"
        });
    }
}));
export const updateVideo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description, videoId } = req.body;
    let updateOptions = { name, description };
    const user = yield User.findById(req === null || req === void 0 ? void 0 : req.user.id).exec();
    const video = yield Video.findById(videoId).exec();
    if (!(video === null || video === void 0 ? void 0 : video.channel.id.equals(user === null || user === void 0 ? void 0 : user.channel))) {
        console.log(video === null || video === void 0 ? void 0 : video.channel.id, user === null || user === void 0 ? void 0 : user.channel);
        res.json({
            status: 400,
            message: "Video doesnt belong to channel owned by user"
        });
        return;
    }
    if (req.file && ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename)) {
        const thumbnailPath = `images/videos/${req.file.filename}`;
        const { secure_url } = yield uploadThumbnail(name, thumbnailPath);
        updateOptions.thumbnail = secure_url;
        fs.unlink(thumbnailPath, (err) => { if (err)
            console.error(err); });
    }
    try {
        yield Video.findByIdAndUpdate(videoId, updateOptions).exec();
        res.json({
            status: 200,
            message: "Video updated sucessfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Video failed to update"
        });
    }
}));
export const replyToVideo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId, review, name, profileImage } = req.body;
    const { id } = req.user;
    if (!videoId)
        return;
    try {
        yield Video.findByIdAndUpdate(videoId, { $push: { reviews: {
                    id,
                    name,
                    profileImage,
                    description: review,
                } } }, { new: true, safe: true, upsert: true }).exec();
        res.json({
            status: 200,
            message: "Comment posted successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Comment failed to post"
        });
    }
}));
export const likeVideo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.body;
    const { id } = req.user;
    try {
        const video = yield Video.findById(videoId).exec();
        const hasLiked = video === null || video === void 0 ? void 0 : video.likes.some((val, i) => val.id === id);
        if (hasLiked) {
            yield Video.findByIdAndUpdate(videoId, { $pull: { likes: {
                        id,
                        liked: true,
                    } } }, { new: true, safe: true, upsert: true }).exec();
            yield User.findByIdAndUpdate(id, { $pull: { liked: {
                        id: videoId,
                        name: video === null || video === void 0 ? void 0 : video.name,
                        thumbnail: video === null || video === void 0 ? void 0 : video.thumbnail,
                    } } }, { new: true, safe: true, upsert: true }).exec();
        }
        else {
            yield Video.findByIdAndUpdate(videoId, { $push: { likes: {
                        id,
                        liked: true,
                    } } }, { new: true, safe: true, upsert: true }).exec();
            yield User.findByIdAndUpdate(id, { $push: { liked: {
                        id: videoId,
                        name: video === null || video === void 0 ? void 0 : video.name,
                        thumbnail: video === null || video === void 0 ? void 0 : video.thumbnail,
                    } } }, { new: true, safe: true, upsert: true }).exec();
        }
        res.json({
            status: 200,
            message: "Liked/disliked successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Liked/disliked failed"
        });
    }
}));
export const getVideo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g, _h;
    const { id } = req.params;
    try {
        const video = yield Video.findById(id).exec();
        const channel = yield Channel.findById(video === null || video === void 0 ? void 0 : video.channel.id).exec();
        video === null || video === void 0 ? void 0 : video.$inc('views', 1);
        let hasLiked;
        let hasSubscribed;
        let hasSaved;
        if ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)
            hasLiked = video === null || video === void 0 ? void 0 : video.likes.some((val, i) => val.id === req.user.id);
        if ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)
            hasSubscribed = channel === null || channel === void 0 ? void 0 : channel.subscribers.some((val, i) => val.id.equals(req.user.id));
        if ((_d = req.user) === null || _d === void 0 ? void 0 : _d.id) {
            const user = yield User.findById(req.user.id).exec();
            hasSaved = user === null || user === void 0 ? void 0 : user.saved.some((val, i) => val.id.equals(id));
        }
        yield (video === null || video === void 0 ? void 0 : video.save());
        let respObj = Object.assign({}, video);
        if (hasLiked)
            respObj = Object.assign(Object.assign({}, respObj._doc), { liked: true });
        else
            respObj = Object.assign(Object.assign({}, respObj._doc), { liked: false });
        if (hasSubscribed)
            respObj = Object.assign(Object.assign({}, respObj), { subscribed: true });
        else
            respObj = Object.assign(Object.assign({}, respObj), { subscribed: false });
        if (hasSaved)
            respObj = Object.assign(Object.assign({}, respObj), { saved: true });
        else
            respObj = Object.assign(Object.assign({}, respObj), { saved: false });
        // add video to user's history
        if ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id) {
            let date = `${(new Date(Date.now())).getDate()}/${(new Date(Date.now())).getMonth() + 1}/${(new Date(Date.now())).getFullYear()}`;
            let historyExists = yield History.exists({ userId: (_f = req.user) === null || _f === void 0 ? void 0 : _f.id, date });
            if (historyExists) {
                yield History.findOneAndUpdate({ userId: (_g = req.user) === null || _g === void 0 ? void 0 : _g.id, date }, { $push: { history: {
                            id,
                            name: video === null || video === void 0 ? void 0 : video.name,
                            thumbnail: video === null || video === void 0 ? void 0 : video.thumbnail,
                        } } }, { new: true, safe: true, upsert: true }).exec();
            }
            else {
                yield History.create({ userId: (_h = req.user) === null || _h === void 0 ? void 0 : _h.id, date, history: [
                        {
                            id,
                            name: video === null || video === void 0 ? void 0 : video.name,
                            thumbnail: video === null || video === void 0 ? void 0 : video.thumbnail,
                        }
                    ] });
            }
        }
        res.json({
            status: 200,
            data: respObj,
            message: "Video retrieved successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Video failed to retrieve"
        });
    }
}));
export const saveVideoToUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l, _m;
    const { id } = req.params;
    const user = yield User.findById((_j = req.user) === null || _j === void 0 ? void 0 : _j.id).exec();
    try {
        const video = yield Video.findById(id).exec();
        let hasSaved;
        if ((_k = req.user) === null || _k === void 0 ? void 0 : _k.id)
            hasSaved = user === null || user === void 0 ? void 0 : user.saved.some((val, i) => val.id.equals(id));
        // add video to saved
        if (!hasSaved) {
            yield User.findByIdAndUpdate((_l = req.user) === null || _l === void 0 ? void 0 : _l.id, { $push: { saved: {
                        id,
                        name: video === null || video === void 0 ? void 0 : video.name,
                        thumbnail: video === null || video === void 0 ? void 0 : video.thumbnail,
                    } } }, { new: true, safe: true, upsert: true }).exec();
            res.json({
                status: 200,
                message: "Video saved successfully"
            });
        }
        else {
            yield User.findByIdAndUpdate((_m = req.user) === null || _m === void 0 ? void 0 : _m.id, { $pull: { saved: {
                        id,
                        name: video === null || video === void 0 ? void 0 : video.name,
                        thumbnail: video === null || video === void 0 ? void 0 : video.thumbnail,
                    } } }, { new: true, safe: true, upsert: true }).exec();
            res.json({
                status: 200,
                message: "Video unsaved successfully"
            });
        }
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Video failed to save/unsave"
        });
    }
}));
export const getVideoBySearch = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const regexiedSearch = new RegExp(search, "i");
    try {
        const videos = yield Video.find({ name: { $regex: regexiedSearch } }).select("name id").exec();
        res.json({
            status: 200,
            data: videos,
            message: "Videos searched successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Videos failed to search"
        });
    }
}));
export const getComments = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const video = yield Video.findById(id).exec();
        res.json({
            status: 200,
            data: video === null || video === void 0 ? void 0 : video.reviews,
            message: "Comments retrieved successfully"
        });
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Comments failed to retrieved"
        });
    }
}));
