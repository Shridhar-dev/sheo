import multer from "multer"
import sharp from "sharp"
import fs from "fs"
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Callback } from "mongoose";

export const checkIfUserBelongsToChannel  = async(req:Request & { body: {id:string} },res:Response,next:NextFunction) =>{
    const { id } = req.body;
    const channel = await Channel.find({userId: id}).exec()
    if(channel) next()
    else throw Error("User cannot upload on this channel")
}

export const checkIfUserIsCreator  = async(req:Request & { body: {id:string} },res:Response,next:NextFunction) =>{
    const { id } = req.body;
    const user:any = await User.find({_id: id}).exec()
    if(user.accountType === "creator") next()
    else throw Error("User is not a creator")
}


const storage = multer.memoryStorage()

const imageFilter = (req:Request, file:Express.Multer.File, cb:Callback) => {
    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
      ) {
        cb(null, true);
      } else {
        cb(new Error('not type jpg/jpeg or png'), false);
      }
  
}

const videoFilter = (req:Request, file:Express.Multer.File, cb:Callback) => {
    if (
        file.mimetype === 'video/jpg' ||
        file.mimetype === 'video/jpeg' ||
        file.mimetype === 'video/png'
      ) {
        cb(null, true);
      } else {
        cb(new Error('not type jpg/jpeg or png'), false);
      }
  
}

export const resize = async(req:any, res:Response, next:NextFunction) => {
    if (req.files.thumbnail[0].mimetype === 'application/octet-stream'){
      next();
      return;
    }
    
    req.files.thumbnail[0].filename = `video-${Date.now()}.jpeg`

    await sharp(req.files.thumbnail[0].buffer)
        .resize(1366,768)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`images/videos/${req.files.thumbnail[0].filename}`)    
        
    next()
}

export const thumbnailResize = async(req:any, res:Response, next:NextFunction) => {
  if(!req.file) { next(); return; }
  if (req.file.mimetype === 'application/octet-stream'){
    next();
    return;
  }

  req.file.filename = `video-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
      .resize(1366,768)
      .toFormat('jpeg')
      .jpeg({quality:90})
      .toFile(`images/videos/${req.file.filename}`)    
      
  next()
}



const upload = multer({ dest: 'uploads/', storage })

export const saveVideo = async(req:any,res:Response,next:NextFunction) =>{
    req.files.video[0].filename = `video-${Date.now()}.mp4`;
    fs.writeFile(`videos/${req.files.video[0].filename}`, req.files.video[0].buffer, (err) => {
        if(!err) console.log('Data written');
    });
    next()
}

//for uploading video and thumbnail for the first time (creation phase)
export const uploadVideo:RequestHandler = upload.fields([{
    name: 'video', maxCount: 1
  }, {
    name: 'thumbnail', maxCount: 1
  }])

// for updating thumbnail
export const uploadThumbnail:RequestHandler = upload.single('thumbnail')


export const setFiles = (req:Request & { files: any},res:Response,next:NextFunction) =>{
  req.files = {}
  req.files.video = []
  req.files.thumbnail = []
  req.files.video[0] = req.body.video
  req.files.thumbnail[0] = req.body.thumbnail
  next()
}
