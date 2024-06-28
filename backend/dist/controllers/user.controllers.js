var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Channel } from "../models/channel.model.js";
import { History } from "../models/history.model.js";
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
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
export const signup = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, profileImage, password, passwordConfirmation } = req.body;
    if (password !== passwordConfirmation) {
        res.json({
            status: 403,
            message: "Passwords dont match"
        });
    }
    else {
        try {
            bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let user = yield User.create({ name, email, profileImage, password: hash, passwordConfirmation: hash });
                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "90d" });
                        res.cookie("access_token", token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none'
                        });
                        res.json({
                            status: 200,
                            data: user,
                            token,
                            message: "User created successfully!"
                        });
                    });
                });
            });
        }
        catch (e) {
            res.json({
                status: 500,
                message: "User failed to create"
            });
        }
    }
}));
export const login = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User.findOne({ email }).select('-passwordConfirmation').exec();
    bcrypt.compare(password, user === null || user === void 0 ? void 0 : user.password, function (err, result) {
        if (result) {
            const token = jwt.sign({ id: user === null || user === void 0 ? void 0 : user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "90d" });
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            res.status(200).json({
                status: 200,
                token: token,
                data: user,
                message: "Logged in successfuly"
            });
        }
        else {
            res.json({
                status: 403,
                message: "Wrong email or password"
            });
        }
    });
}));
export const logout = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200)
        .json({
        status: 200,
        message: "User logged out successfully!"
    });
}));
export const getUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (id) {
        const user = yield User.findOne({ _id: id }).select(' -password -passwordConfirmation').exec();
        if (!user) {
            res.json({
                status: 400,
                message: "User not found"
            });
        }
        else {
            res.json({
                status: 200,
                data: user,
                message: "User fetched successfully"
            });
        }
    }
    else {
        res.json({
            status: 202,
            data: null,
            message: "User is not logged in"
        });
    }
}));
export const subscribe = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { id: channelId } = req.params;
    if (id) {
        const user = yield User.findOne({ _id: id }).select(' -password -passwordConfirmation').exec();
        if (!user) {
            res.json({
                status: 400,
                message: "User not found"
            });
        }
        else {
            const channel = yield Channel.findById(channelId).exec();
            if (channel) {
                const hasSubscribed = channel.subscribers.some((val, i) => val.id.equals(id));
                if (!hasSubscribed) {
                    yield User.findByIdAndUpdate(req.user.id, { $push: { subscriptions: {
                                id: channelId,
                                name: channel.name,
                                avatar: channel.avatar,
                            } } }, { new: true, safe: true, upsert: true }).exec();
                    yield channel.updateOne({ $push: { subscribers: { id } } }).exec();
                    res.json({
                        status: 200,
                        message: "Subscribed sucessfully!"
                    });
                }
                else {
                    yield User.findByIdAndUpdate(req.user.id, { $pull: { subscriptions: {
                                id: channelId,
                                name: channel.name,
                                avatar: channel.avatar,
                            } } }, { new: true, safe: true, upsert: true }).exec();
                    yield channel.updateOne({ $pull: { subscribers: { id } } }).exec();
                    res.json({
                        status: 200,
                        message: "Unsubscribed sucessfully!"
                    });
                }
            }
            else {
                res.json({
                    status: 402,
                    message: "Channel not found"
                });
            }
        }
    }
    else {
        res.json({
            status: 402,
            data: null,
            message: "User is not logged in"
        });
    }
}));
export const getHistory = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (id) {
        const history = yield History.find({ userId: id }).select('date history').exec();
        if (!history) {
            res.json({
                status: 400,
                message: "User not found"
            });
        }
        else {
            res.json({
                status: 200,
                data: history,
                message: "History fetched successfully"
            });
        }
    }
    else {
        res.json({
            status: 202,
            data: null,
            message: "User is not logged in"
        });
    }
}));
export const changeAccountType = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    const { id } = req.user;
    yield User.findOneAndUpdate({ _id: id }, { accountType: type }).exec();
    res.json({
        status: 200,
        message: "Account type changed successfully"
    });
}));
export const updateUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.user;
    let profileImage;
    if (req.file.filename) {
        const avatarPath = `images/users/${req.file.filename}`;
        const { secure_url } = yield uploadAvatar(name, avatarPath);
        profileImage = secure_url;
        fs.unlink(avatarPath, (err) => { if (err)
            console.error(err); });
    }
    try {
        const user = yield User.findById(id).exec();
        if (user) {
            yield User.findByIdAndUpdate(id, { name: name === "" ? user.name : name, profileImage: profileImage || user.profileImage });
            res.json({
                status: 200,
                message: "User updated successfully"
            });
        }
        else {
            res.json({
                status: 400,
                message: "User not found"
            });
        }
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Error updating user"
        });
    }
}));
export const changeUserPassword = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, passwordConfirmation } = req.body;
    const { id } = req.user;
    try {
        const user = yield User.findById(id).exec();
        if (user) {
            if (password !== passwordConfirmation) {
                res.json({
                    status: 403,
                    message: "Passwords dont match"
                });
            }
            else {
                bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield User.findByIdAndUpdate(id, { password: hash, passwordConfirmation: hash });
                            res.json({
                                status: 200,
                                data: user,
                                message: "Password changed successfully!"
                            });
                        });
                    });
                });
            }
        }
        else {
            res.json({
                status: 400,
                message: "User not found"
            });
        }
    }
    catch (e) {
        res.json({
            status: 500,
            message: "Error changing password"
        });
    }
}));
