"use client"

import { AppContext } from "@/components/interface/MainView"
import VideoCard from "@/components/interface/Video"
import { useContext } from "react"

interface VideoInterface {
  _id: string,
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
  
  return (
    <main className="text-white p-8">
      <p className="text-2xl font-semibold mb-5">Saved Videos</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 gap-y-8'>
          {
            app.user?.saved.length > 0 && app.user.saved.map((video:VideoInterface, i:number)=>(
              <VideoCard key={i} name={video.name} views={1} link={video._id} thumbnail={video.thumbnail} channel={""} channelSrc="" />
            ))
          }
          {app.user?.saved.length === 0 && <p className='text-white'>No videos saved as of yet</p>}
      </div>
    </main>
  )
}

export default SavedVideosPage