"use client"

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { get } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

export default function Component() {
    const { id } = useParams();
    const [channel, setChannel] = useState<any>({avatar:"",videoList:[],name:"", description:""})
    const { push } = useRouter()
    const getChannel = async() =>{
      const response = await get(`channel/${id}`);
      if(response.status === 200){
        setChannel(response.data);
      } 
      else{
        if(response.status === 400){
          push("/")
        }
        toast({ title: "There was an error getting channel details", description: `${response.message}`}) 
        console.error("Error getting channel", `Status Code: ${response.status}`, `Message: ${response.message}`)
      }
      
    }

    useEffect(()=>{
      getChannel()
    },[])

    return (
      <div className="w-full mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="flex-shrink-0">
            <Image
              alt="Channel Avatar"
              className="rounded-full"
              height={80}
              src={channel.avatar}
              style={{
                aspectRatio: "80/80",
                objectFit: "cover",
              }}
              width={80}
            />
          </div>
          <div className="space-y-">
            <h1 className="text-2xl text-white font-bold">{channel.name}</h1>
            <p className="text-gray-500 dark:text-gray-800">
              {channel.description}
            </p>
            <p className="text-gray-500 dark:text-gray-800 text-sm">
              {channel.views} views
            </p>
          </div>
          <div>

          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            channel && channel.videoList.length > 0 && 
            channel.videos.map((video:any,i:number)=>(
              <Link key={i} href={`/video/${video._id}`} className="relative rounded-lg overflow-hidden">
                <Image
                  alt="Video Thumbnail"
                  className="aspect-video object-cover"
                  height={225}
                  src={video.thumbnail}
                  width={800}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-lg line-clamp-2 px-4">
                    {video.name}
                  </h3>
                </div>
              </Link>
            ))
          }
          {channel && !(channel.videoList.length > 0) && <p className="text-white">No videos posted as of yet!</p>}
        </div>
      </div>
    )
  }