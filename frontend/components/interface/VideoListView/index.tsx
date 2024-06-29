"use client"

import { get } from '@/lib/api'
import VideoCard from '../Video'
import useSWR from "swr";
import SkeletonVideoCard from '../SkeletonVideoCard'

const fetcher = async(url:string) => ( (await get(url)).data );

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

function VideoListView() {
  
  const { data: videos, isLoading, error } = useSWR(
    "video/all",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (error) {
    return <p className='text-white'>Failed to fetch</p>;
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-5 gap-5 gap-y-8'>
        {
          Array.from([1,2,3,4,5,6,7,8,9]).map((num:number, i:number)=>(
            <SkeletonVideoCard key={i} />
          ))
        }
      </div>
    );
  }

  

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-5 pb-20 gap-5 gap-y-8'>
        {
          videos.length > 0 && videos.map((video:VideoInterface, i:number)=>(
            <VideoCard key={i} name={video.name} views={video.views} link={video._id} thumbnail={video.thumbnail} channel={video.channel} channelSrc="" />
          ))
        }
        {videos.length === 0 && <p className='text-white'>No videos as of yet</p>}
    </div>
  )
}

export default VideoListView