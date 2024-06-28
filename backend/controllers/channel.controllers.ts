import mongoose, { PipelineStage } from "mongoose";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { NextFunction, Request, Response } from "express";

const uploadAvatar = async(title:string, image:string):Promise<UploadApiResponse | any> => {

  try{
        return await cloudinary.uploader.upload(image, { public_id: title }, 
        function(error:any, result) {
            if(error){
               throw Error(error)
            }
            else return result    
        });
    }
    catch(e:any){
        return e
    }
}

export const createChannel:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:any,res:Response) => {
    const { name, description } = req.body;
    const { id } = req.user;

    const avatarPath = `images/channels/${req.file.filename}`

    const { secure_url: avatar } = await uploadAvatar(name,avatarPath)

    fs.unlink(avatarPath,(err)=>{if(err) console.error(err)});

    try{  
        const user = await User.findById(id).exec()
        if(user?.channel){
            res.json({
                status: 400,
                message:"User already has a channel"
            })
            return;
        }
        
        const channelObj = await Channel.create({name, description, avatar, userId:id});
        await User.findByIdAndUpdate(id,{ channel:channelObj._id, accountType:"creator" });
        
        res.json({
            status: 200,
            link: `http://localhost:3000/channel/${channelObj._id}`,
            message:"Channel created successfully"
        })
    }
    catch(e){
      res.json({
        status: 500,
        message:"Channel failed to create"
      })
    }

})

export const getChannel:(req:Request, res:Response, next:NextFunction)=>void = asyncHandler(async(req:Request,res:Response) => {
    const { id } = req.params;
    
    try{   
        const channel:any = await Channel.findById(id).exec()
        if(!channel){
          res.json({
            status: 400,
            message:"Channel does not exist"
          })
          return;
        }
        const videos = await Video.find({"channel.id":id}).exec()
        const views = await getTotalViews(id)
        const comments = await getTotalComments(id)
        const { subscriberCount, videoCount } = await getSubscriberAndVideoCount(channel?.name)
        
        res.json({
            status: 200,
            data: {...channel?._doc, views, subscriberCount, videoCount, comments, videos},
            message:"Channel retrieved successfully"
        })
    }
    catch(e){
      res.json({
        status: 500,
        message:"Channel failed to retrieve"
      })
    }

})




// aggregations

const getSubscriberAndVideoCount = async(name:string) => {
    const data = await Channel.aggregate([{ $match: { name: name } }]).exec()
    return ({
        subscriberCount : data[0].subscribers.length,
        videoCount : data[0].videoList.length,
    })
}

const getTotalViews = async(id:string) => {
    
    const aggregateQuery = [
        {
          $match: {
            "channel.id": new mongoose.Types.ObjectId(id) 
          }
        },
        {
          $group: {
            _id: null, 
            totalViews: { $sum: "$views" } 
          }
        }
      ];

    const data = await Video.aggregate(aggregateQuery).exec();
    return (data[0]? data[0].totalViews : 0)
}

const getTotalComments = async(channelId:string) => {
    const pipeline:PipelineStage[] = [
        {
          $match: {
            'channel.id': new mongoose.Types.ObjectId(channelId)
          }
        },
        {
          $unwind: '$reviews'
        },
        {
          $sort: {
            'reviews.publishedAt': -1 
          }
        },
        {
          $group: {
            _id: '$channel.id',
            reviewCount: { $sum: 1 },
            reviews: { $push: '$reviews' } 
          }
        }
      ];

      const data = await Video.aggregate(pipeline).exec();
      return (data[0]? data[0].comments : { reviewCount:0, reviews:[] })
}