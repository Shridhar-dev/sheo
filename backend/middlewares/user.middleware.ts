import { NextFunction, Request, RequestHandler, Response } from "express";
import multer, { FileFilterCallback } from "multer"
import sharp from "sharp"
import jwt from "jsonwebtoken";

export const verifyJWT = async(req:any,res:Response,next:NextFunction) =>{
    const token = req.cookies.access_token;
    
    if(!token)
        throw new Error("No token provided")

    const verification = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    
    if(typeof verification === 'object'){
        req.user = {}
        req.user.id = verification?.id
        next()
    }
    else{
        
    }
}

export const checkIfUserIsAuthenticated = async(req:any,res:Response,next:NextFunction) =>{
    let token = req.cookies.access_token;
    req.user = {}
    if(token){
        if(token[token.length-1] === ",") token = token.slice(0, token.length-1);
        
        const verification = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        if(typeof verification === 'object'){
            
            req.user.id = verification?.id
            next()
        }
        else{
                
        }
        
    }
    else{
        next()
    }
}


const storage = multer.memoryStorage()

const fileFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    
    if(file.mimetype === 'application/octet-stream') {
        cb(null, true) 
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

export const resize = async(req:any, res:Response, next:NextFunction) => {
    if (req.file.mimetype === 'application/octet-stream'){
        next();
        return;
    }
    req.file.filename = `user-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(300,300)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`images/users/${req.file.filename}`)    
        
    next()
}

const upload = multer({ dest: 'uploads/', storage, fileFilter })

export const uploadImage:RequestHandler = upload.single('profileImage')
