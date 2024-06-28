import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Channel } from "../models/channel.model.js";
import { History } from "../models/history.model.js";
import { NextFunction, Request, Response } from "express";
import fs from 'fs';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

const uploadAvatar = async(title:string, image:string):Promise<UploadApiResponse | any> => {
    try{
        return await cloudinary.uploader.upload(image, { public_id: title }, 
        function(error:any, result) {
            if(error) throw Error(error);
            else return result    
        });
    }
    catch(e:any){
        return e
    }
}

export const signup:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request,res:Response) => {
    const { name, email, profileImage, password, passwordConfirmation } = req.body;    

    if(password !== passwordConfirmation){
        res.json({
            status:403,
            message:"Passwords dont match"
        })
    }
    else{
        try{
            bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!), function(err, salt) {
                bcrypt.hash(password, salt, async function(err, hash) {
                    let user = await User.create({ name, email, profileImage, password:hash, passwordConfirmation:hash })
                    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET_KEY!, { expiresIn:"90d" });

                    res.cookie("access_token", token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    })
                    res.json({
                        status:200,
                        data:user,
                        token,
                        message:"User created successfully!"
                    })
                });
            });
        }
        catch(e){
            res.json({
                status: 500,
                message:"User failed to create"
            })
        }
    }
})



export const login:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request,res:Response) => {
    const { email, password } = req.body;    
    
    const user = await User.findOne({email}).select('-passwordConfirmation').exec()
    bcrypt.compare(password, user?.password!, function(err, result) {

       if(result){
            const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET_KEY!, { expiresIn:"90d" });
            
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
              })
            res.status(200).json({
                status:200,
                token: token,
                data:user,
                message:"Logged in successfuly"
            })
       } 
       else{
            res.json({
                status:403,
                message:"Wrong email or password"
            })
       }
    });
})

export const logout:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request,res:Response) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
    
    res.status(200)
    .json({
        status:200,
        message:"User logged out successfully!"
    })
})

export const getUser:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user: any },res:Response) => {
    const { id } = req.user;    
    if(id){
        const user = await User.findOne({_id: id}).select(' -password -passwordConfirmation').exec()
        if(!user){
            res.json({
                status:400,
                message:"User not found"
            })
        }
        else{
            res.json({
                status:200,
                data:user,
                message:"User fetched successfully"
            })
        }
    }
    else{
        res.json({
            status:202,
            data:null,
            message:"User is not logged in"
        })
    }
})

export const subscribe:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any },res:Response) => {
    const { id } = req.user;  
    const { id: channelId } = req.params;  
    if(id){
        const user = await User.findOne({_id: id}).select(' -password -passwordConfirmation').exec()
        if(!user){
            res.json({
                status:400,
                message:"User not found"
            })
        }
        else{
            const channel = await Channel.findById(channelId).exec()

            if(channel){
                const hasSubscribed = channel.subscribers.some((val, i)=>val.id.equals(id));

                if(!hasSubscribed){
                    await User.findByIdAndUpdate(req.user.id,
                        { $push: { subscriptions: {
                            id: channelId,
                            name: channel.name,
                            avatar: channel.avatar,
                        } } },
                        { new: true, safe: true, upsert: true },).exec()

                    await channel.updateOne(
                        { $push: { subscribers: { id } } },
                    ).exec()

                    res.json({
                        status:200,
                        message:"Subscribed sucessfully!"
                    })
                }
                else{
                    await User.findByIdAndUpdate(req.user.id,
                        { $pull: { subscriptions: {
                            id: channelId,
                            name: channel.name,
                            avatar: channel.avatar,
                        } } },
                        { new: true, safe: true, upsert: true },).exec()

                    await channel.updateOne(
                        { $pull: { subscribers: { id } } },
                    ).exec()

                    res.json({
                        status:200,
                        message:"Unsubscribed sucessfully!"
                    })
                }
            }
            else{
                res.json({
                    status:402,
                    message:"Channel not found"
                })
            }
        }
    }
    else{
        res.json({
            status:402,
            data:null,
            message:"User is not logged in"
        })
    }
})

export const getHistory:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any }, res:Response) => {
    const { id } = req.user;    
    if(id){
        const history = await History.find({userId: id}).select('date history').exec()
        if(!history){
            res.json({
                status:400,
                message:"User not found"
            })
        }
        else{
            res.json({
                status:200,
                data:history,
                message:"History fetched successfully"
            })
        }
    }
    else{
        res.json({
            status:202,
            data:null,
            message:"User is not logged in"
        })
    }
})

export const changeAccountType:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any }, res:Response) => {
    const { type } = req.body;    
    const { id } = req.user;
    await User.findOneAndUpdate({_id:id}, {accountType:type}).exec()
    res.json({
        status:200,
        message:"Account type changed successfully"
    })
})



export const updateUser:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:any,res:Response) => {
    const { name } = req.body;
    const { id } = req.user;

    let profileImage;

    if(req.file.filename){
        const avatarPath = `images/users/${req.file.filename}`
        const { secure_url } = await uploadAvatar(name,avatarPath)
        profileImage = secure_url
        fs.unlink(avatarPath,(err)=>{if(err) console.error(err)});
    }

    try{  
        const user = await User.findById(id).exec()
        if(user){
            await User.findByIdAndUpdate(id,{ name: name === "" ? user.name : name, profileImage: profileImage || user.profileImage });
            res.json({
                status: 200,
                message:"User updated successfully"
            })
        }
        else{
            res.json({
                status: 400,
                message:"User not found"
            })
        }
    }
    catch(e){
        res.json({
            status: 500,
            message:"Error updating user"
        })
    }

})

export const changeUserPassword:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:any,res:Response) => {
    const { password, passwordConfirmation } = req.body;
    const { id } = req.user;

    try{  
        const user = await User.findById(id).exec()
        if(user){
            if(password !== passwordConfirmation){
                res.json({
                    status:403,
                    message:"Passwords dont match"
                })
            }
            else{
                bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS!), function(err, salt) {
                    bcrypt.hash(password, salt, async function(err, hash) {

                        await User.findByIdAndUpdate(id,{ password:hash, passwordConfirmation:hash });

                        res.json({
                            status:200,
                            data:user,
                            message:"Password changed successfully!"
                        })
                    });
                });
            }
        }
        else{
            res.json({
                status: 400,
                message:"User not found"
            })
        }
    }
    catch(e){
        res.json({
            status: 500,
            message:"Error changing password"
        })
    }

})