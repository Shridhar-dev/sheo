import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface VideoCardType {
    link: string,
    thumbnail: string,
    name: string,
    channel: any,
    channelSrc: string,
    views: number
}

function VideoCard({ link, thumbnail, name, channel, channelSrc, views }:VideoCardType) {
  return (
    <Link href={`/video/${link}`}>
        <div className=''>
            <Image 
                src={thumbnail}
                height={768}
                width={1366}
                alt=''
            />
        </div>
        <div className='mt-2 flex items-start gap-3'>
            {
                channel && 
                <div className='rounded-full flex justify-center items-center h-10 w-10'>
                    <Image 
                        src={channel?.avatar}
                        height={45}
                        width={45}
                        alt=''
                        className='rounded-full flex justify-center items-center h-10 w-10'
                    />
                </div>
            }
            <div className=''>
                <p className=' text-white text-md font-medium'>{name}</p>
                {channel && <p className=' text-white text-sm text-opacity-50 font-medium'>{channel?.name} • {views} views </p>}
            </div>
        </div>
    </Link>
  )
}

export default VideoCard