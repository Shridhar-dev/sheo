import multer from "multer";
import sharp from "sharp";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('not type pdf or jpg/jpeg or png'));
    }
};
export const resize = (req, res, next) => {
    if (!req.file)
        next();
    req.file.filename = `channel-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`images/channels/${req.file.filename}`);
    next();
};
const upload = multer({ dest: 'uploads/', storage, fileFilter });
export const uploadImage = upload.single('avatar');
