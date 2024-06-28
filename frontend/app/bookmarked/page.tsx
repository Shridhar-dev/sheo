"use client"

import { AppContext } from "@/components/interface/MainView"
import VideoCard from "@/components/interface/Video"
import { useContext, useEffect } from "react"

interface VideoInterface {
  _id: string,
  id:string,
  name:string,
  link:string,
  thumbnail:string,
  likes: {id:string, liked: boolean}[],
  views: number,
  channel: {
    id: string,
    name: string,
    avatar: string,
  },
  reviews: {
    id: string,
    name:string,
    description: string,
    profileImage: string,
    publishedAt: Date
  }[],
  publishedAt: Date
}

function SavedVideosPage() {
  const app = useContext<any>(AppContext)
  
  useEffect(()=>{
    app.getAcc()
  },[])
  
  return (
    <main className="text-white p-8">
      <p className="text-2xl font-semibold">Bookmarked Videos</p>
      <p className="text-gray-500 mt-0.5 mb-5">Collection of all the videos you have bookmarked!</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 gap-y-8'>
          {
            app.user?.saved.length > 0 && app.user.saved.map((video:VideoInterface, i:number)=>(
              <VideoCard key={i} name={video.name} views={1} link={video.id} thumbnail={video.thumbnail} channel={""} channelSrc="" />
            ))
          }
          {app.user?.saved.length === 0 && <p className='text-white'>No videos bookmarked as of yet</p>}
      </div>
    </main>
  )
}

export default SavedVideosPage