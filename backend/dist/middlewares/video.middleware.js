var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
export const checkIfUserBelongsToChannel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const channel = yield Channel.find({ userId: id }).exec();
    if (channel)
        next();
    else
        throw Error("User cannot upload on this channel");
});
export const checkIfUserIsCreator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const user = yield User.find({ _id: id }).exec();
    if (user.accountType === "creator")
        next();
    else
        throw Error("User is not a creator");
});
const storage = multer.memoryStorage();
const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('not type jpg/jpeg or png'), false);
    }
};
const videoFilter = (req, file, cb) => {
    if (file.mimetype === 'video/jpg' ||
        file.mimetype === 'video/jpeg' ||
        file.mimetype === 'video/png') {
        cb(null, true);
    }
    else {
        cb(new Error('not type jpg/jpeg or png'), false);
    }
};
export const resize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.files.thumbnail[0].mimetype === 'application/octet-stream') {
        next();
        return;
    }
    req.files.thumbnail[0].filename = `video-${Date.now()}.jpeg`;
    yield sharp(req.files.thumbnail[0].buffer)
        .resize(1366, 768)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`images/videos/${req.files.thumbnail[0].filename}`);
    next();
});
export const thumbnailResize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        next();
        return;
    }
    if (req.file.mimetype === 'application/octet-stream') {
        next();
        return;
    }
    req.file.filename = `video-${Date.now()}.jpeg`;
    yield sharp(req.file.buffer)
        .resize(1366, 768)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`images/videos/${req.file.filename}`);
    next();
});
const upload = multer({ dest: 'uploads/', storage });
export const saveVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.files.video[0].filename = `video-${Date.now()}.mp4`;
    fs.writeFile(`videos/${req.files.video[0].filename}`, req.files.video[0].buffer, (err) => {
        if (!err)
            console.log('Data written');
    });
    next();
});
//for uploading video and thumbnail for the first time (creation phase)
export const uploadVideo = upload.fields([{
        name: 'video', maxCount: 1
    }, {
        name: 'thumbnail', maxCount: 1
    }]);
// for updating thumbnail
export const uploadThumbnail = upload.single('thumbnail');
export const setFiles = (req, res, next) => {
    req.files = {};
    req.files.video = [];
    req.files.thumbnail = [];
    req.files.video[0] = req.body.video;
    req.files.thumbnail[0] = req.body.thumbnail;
    next();
};
