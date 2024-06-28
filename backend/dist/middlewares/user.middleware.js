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
import jwt from "jsonwebtoken";
export const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    if (!token)
        throw new Error("No token provided");
    const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (typeof verification === 'object') {
        req.user = {};
        req.user.id = verification === null || verification === void 0 ? void 0 : verification.id;
        next();
    }
    else {
    }
});
export const checkIfUserIsAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.cookies.access_token;
    req.user = {};
    if (token) {
        if (token[token.length - 1] === ",")
            token = token.slice(0, token.length - 1);
        const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (typeof verification === 'object') {
            req.user.id = verification === null || verification === void 0 ? void 0 : verification.id;
            next();
        }
        else {
        }
    }
    else {
        next();
    }
});
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/octet-stream') {
        cb(null, true);
        return;
    }
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('not type pdf or jpg/jpeg or png'));
    }
};
export const resize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file.mimetype === 'application/octet-stream') {
        next();
        return;
    }
    req.file.filename = `user-${Date.now()}.jpeg`;
    yield sharp(req.file.buffer)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`images/users/${req.file.filename}`);
    next();
});
const upload = multer({ dest: 'uploads/', storage, fileFilter });
export const uploadImage = upload.single('profileImage');
