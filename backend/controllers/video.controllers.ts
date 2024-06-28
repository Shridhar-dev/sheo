import { Video } from "../models/video.model.js";
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { asyncHandler } from "../utils/asyncHandler.js";
import { Channel } from "../models/channel.model.js";
import fs from "fs"
import { History } from "../models/history.model.js";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";

const uploadVideo = async(title:string, video:string):Promise<UploadApiResponse | any>  => {

    try{
        return await cloudinary.uploader.upload(video, { public_id: title, resource_type:'raw' }, 
        function(error:any, result) {
            if(error) {
                console.error(error)
                throw Error(error);
            }
            else return result    
        });
    }
    catch(e){
        
    }
}


const uploadThumbnail = async(title:string, image:string):Promise<UploadApiResponse | any> => {
    try{
        return await cloudinary.uploader.upload(image, { public_id: title }, 
        function(error:any, result) {
            if(error) throw Error(error);
            else return result    
        });
    }
    catch(e){
        
    }
}

export const getAllVideos:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request,res:Response) => {
    try{  
        const videos = await Video.find({});
        res.json({
            status: 200,
            data:videos,
            message:"Videos fetched successfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Videos failed to fetched"
        })
    }
})

export const createVideo:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any, files:any }, res:Response) => {
    const { name, description } = req.body;
    const { id } = req.user;

    const thumbnailPath = `images/videos/${req.files.thumbnail[0].filename}`
    const videoPath = `videos/${req.files.video[0].filename}`

    const { secure_url: video } = await uploadVideo(name,videoPath)
    const { secure_url: thumbnail } = await uploadThumbnail(name,thumbnailPath)

    fs.unlink(videoPath,(err)=>{if(err) console.error(err)});
    fs.unlink(thumbnailPath,(err)=>{if(err) console.error(err)});

    try{  
        const channelObj = await Channel.find({userId:id}).exec()
        
        const videoObj = await Video.create({name, link:video, thumbnail, description, channel:{
            id:channelObj[0]._id,
            avatar:channelObj[0].avatar,
            name:channelObj[0].name
        }});

        await channelObj[0].updateOne({ $push: { videoList: videoObj._id } }).exec()
        await channelObj[0].updateOne({ $push: { history: { id:videoObj._id, thumbnail, name } } }).exec()
        
        res.json({
            status: 200,
            link: `http://localhost:3000/video/${videoObj._id}`,
            message:"Video fetched suvessfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Video failed to fetch"
        })
    }

})

export const updateVideo:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { file:any, user:any }, res:Response) => {
    const { name, description, videoId } = req.body;
    
    let updateOptions:{name:string, description:string, thumbnail?:string} = { name, description }
    
    const user = await User.findById(req?.user.id).exec()
    const video:any = await Video.findById(videoId).exec()

    if(!video?.channel.id.equals(user?.channel)){
        res.json({
            status: 400,
            message:"Video doesnt belong to channel owned by user"
        })
        return;
    }

    if(req.file && req.file?.filename){
        const thumbnailPath = `images/videos/${req.file.filename}`
        const { secure_url } = await uploadThumbnail(name,thumbnailPath)
        updateOptions.thumbnail = secure_url
        fs.unlink(thumbnailPath,(err)=>{if(err) console.error(err)});
    }
    
    try{  

        await Video.findByIdAndUpdate(videoId,updateOptions).exec();
        
        res.json({
            status: 200,
            message:"Video updated sucessfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Video failed to update"
        })
    }

})

export const replyToVideo:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any }, res:Response) => {
    const { videoId, review, name, profileImage } = req.body;
    const { id } = req.user;
    if(!videoId) return;
    try{   
        
        await Video.findByIdAndUpdate(videoId, 
                        { $push: { reviews: {
                            id,
                            name,
                            profileImage,
                            description:review,
                        } } },
            { new: true, safe: true, upsert: true },).exec()

        res.json({
            status: 200,
            message:"Comment posted successfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Comment failed to post"
        })
    }

})

export const likeVideo:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any },res:Response) => {
    const { videoId } = req.body;
    const { id } = req.user;

    try{   
        const video = await Video.findById(videoId).exec();
        const hasLiked = video?.likes.some((val, i)=>val.id === id)

        if(hasLiked){
            await Video.findByIdAndUpdate(videoId, 
                { $pull: { likes: {
                    id,
                    liked:true,
                } } },
            { new: true, safe: true, upsert: true },).exec()
            await User.findByIdAndUpdate(id, 
                { $pull: { liked: {
                    id:videoId,
                    name: video?.name,
                    thumbnail: video?.thumbnail,
                } } },
            { new: true, safe: true, upsert: true },).exec()
        }
        else{
            await Video.findByIdAndUpdate(videoId, 
                { $push: { likes: {
                    id,
                    liked:true,
                } } },
            { new: true, safe: true, upsert: true },).exec()
            await User.findByIdAndUpdate(id, 
                { $push: { liked: {
                    id:videoId,
                    name: video?.name,
                    thumbnail: video?.thumbnail,
                } } },
            { new: true, safe: true, upsert: true },).exec()
        }
        res.json({
            status: 200,
            message:"Liked/disliked successfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Liked/disliked failed"
        })
    }

})

export const getVideo:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any },res:Response) => {
    const { id } = req.params;
    
    try{   
        const video = await Video.findById(id).exec()
        const channel = await Channel.findById(video?.channel.id).exec()
        video?.$inc('views', 1);
        let hasLiked;
        let hasSubscribed;
        let hasSaved;
        if(req.user?.id) hasLiked = video?.likes.some((val, i)=>val.id === req.user.id);
        if(req.user?.id) hasSubscribed = channel?.subscribers.some((val, i)=>val.id.equals(req.user.id));
        if(req.user?.id){
            const user = await User.findById(req.user.id).exec()
            hasSaved = user?.saved.some((val, i)=>val.id.equals(id));
        }
        await video?.save();

        let respObj:any = {...video}
        if(hasLiked) respObj = {...respObj._doc, liked:true}
        else respObj = {...respObj._doc, liked:false}

        if(hasSubscribed) respObj = {...respObj, subscribed:true}
        else respObj = {...respObj, subscribed:false}

        if(hasSaved) respObj = {...respObj, saved:true}
        else respObj = {...respObj, saved:false}
        

        // add video to user's history
        if(req.user?.id) {
            let date = `${(new Date(Date.now())).getDate()}/${(new Date(Date.now())).getMonth()+1}/${(new Date(Date.now())).getFullYear()}`
            let historyExists = await History.exists({userId: req.user?.id, date }); 
            if(historyExists){
            
                await History.findOneAndUpdate({userId:req.user?.id, date},
                    { $push: { history: {
                        id,
                        name: video?.name,
                        thumbnail: video?.thumbnail,
                    } } },
                    { new: true, safe: true, upsert: true },).exec()
            }
            else{
                await History.create({userId:req.user?.id, date, history:[
                    {
                        id,
                        name: video?.name,
                        thumbnail: video?.thumbnail,
                    }
                ]})
            }
        }

        res.json({
            status: 200,
            data: respObj,
            message:"Video retrieved successfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Video failed to retrieve"
        })
    }

})

export const saveVideoToUser:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request & { user:any },res:Response) => {
    const { id } = req.params;
    const user = await User.findById(req.user?.id).exec()
    
    try{ 
        const video = await Video.findById(id).exec()
        let hasSaved;
        if(req.user?.id) hasSaved = user?.saved.some((val, i)=>val.id.equals(id));
        
        // add video to saved
        if(!hasSaved){
            await User.findByIdAndUpdate(req.user?.id,
                { $push: { saved: {
                    id,
                    name: video?.name,
                    thumbnail: video?.thumbnail,
                } } },
                { new: true, safe: true, upsert: true },).exec()

            res.json({
                status: 200,
                message:"Video saved successfully"
            })
        }
        else{
            await User.findByIdAndUpdate(req.user?.id, 
                { $pull: { saved: {
                    id,
                    name: video?.name,
                    thumbnail: video?.thumbnail,
                } } },
            { new: true, safe: true, upsert: true },).exec()

            res.json({
                status: 200,
                message:"Video unsaved successfully"
            })
        }
    }
    catch(e){
        res.json({
            status: 500,
            message:"Video failed to save/unsave"
        })
    }

})

export const getVideoBySearch:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request,res:Response) => {
    const { search }:any = req.query;
    const regexiedSearch = new RegExp(search, "i");

    try{   
        const videos = await Video.find({ name: { $regex: regexiedSearch } }).select("name id").exec()
        
        res.json({
            status: 200,
            data: videos,
            message:"Videos searched successfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Videos failed to search"
        })
    }

})

export const getComments:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request,res:Response) => {
    const { id } = req.params;
    
    try{   
        const video = await Video.findById(id).exec()
        res.json({
            status: 200,
            data: video?.reviews,
            message:"Comments retrieved successfully"
        })
    }
    catch(e){
        res.json({
            status: 500,
            message:"Comments failed to retrieved"
        })
    }

})
