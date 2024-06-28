"use client"
import VideoCard from "@/components/interface/Video";
import { toast } from "@/components/ui/use-toast";
import { get } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface VideoInterface {
  id:string,
  thumbnail:string,
  name:string
}

interface HistoryInterface {
  date:string,
  history:Array<VideoInterface>
}

export default function History() {
  const [histories, setHistories] = useState([])

  const getHistory = async() =>{
    const res = await get("user/history")
    if(res.status === 200){
      setHistories(res.data)
    }
    else{
      toast({ title: "There was an getting your history", description: `${res.message}`}) 
    }
  }

  useEffect(()=>{
    getHistory()
  },[])
  
  return (   
    <main className="text-white p-8">
      <p className="text-2xl font-semibold">History</p>
      <div className="mt-5">
        {
          histories.map((historyDate:HistoryInterface, i:number)=>(
            <div key={i} className="mb-10">
              <p className="font-semibold text-4xl">{historyDate.date}</p>
              <div className="flex overflow-x-auto gap-5 items-start">
              {
                historyDate.history.map((video:VideoInterface, i:number)=>(
                  <div key={i} className="min-w-[300px] max-w-[400px] overflow-hidden mt-5">
                    <Link href={`/video/${video.id}`}>
                        <div className=''>
                            <Image 
                                src={video.thumbnail}
                                height={768}
                                width={500}
                                alt=''
                            />
                        </div>
                        <div className='mt-2 flex items-start gap-3'>
                            {/*<div className='rounded-full flex justify-center items-center h-10 w-10'>
                            <Image 
                                src={channel.avatar}
                                height={45}
                                width={45}
                                alt=''
                                className='rounded-full flex justify-center items-center h-10 w-10'
                  />
                            </div>*/}
                            <div className=''>
                                <p className=' text-white text-xl font-semibold'>{video.name}</p>
                            </div>
                        </div>
                    </Link>
                  </div>
                ))
              }
              </div>
            </div>
          ))
        }
        
      </div>
    </main>
  );
}
