import { NextFunction, Request, RequestHandler, Response } from "express";
import multer, { FileFilterCallback } from "multer"
import sharp from "sharp"

const storage = multer.memoryStorage()

const fileFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    if(file.mimetype === "application/octet-stream"){
      cb(null, true);
      return;
    }

    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
      ) {
        cb(null, true);
      } else {
        cb(new Error('not type pdf or jpg/jpeg or png'));
      }
  
}

export const resize = (req:any, res:Response, next:NextFunction) => {
    if(!req.file) next();
    if(req.file.mimetype === "application/octet-stream"){
      res.json({
        status:400,
        message:"Channel cannot be created without channel image"
      })
      return;
    }
    req.file.filename = `channel-${Date.now()}.jpeg`

    sharp(req.file.buffer)
        .resize(300,300)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`images/channels/${req.file.filename}`)    
        
    next()
}

const upload = multer({ dest: 'uploads/', storage, fileFilter })

export const uploadImage:RequestHandler = upload.single('avatar')
