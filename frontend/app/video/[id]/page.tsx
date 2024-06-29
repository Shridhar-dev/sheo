"use client"
import SearchBar from "@/components/interface/SearchBar"
import Thumbnail from '@/assets/thumbnail.jpg'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Bookmark, Clock, Folder, Heart, SendHorizonal, Share2, ThumbsUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useContext, useEffect, useState } from "react"
import { get, post } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import { AppContext } from "@/components/interface/MainView"
import { toast } from "@/components/ui/use-toast"

interface ReviewInterface {
  id: string,
  name:string,
  description: string,
  profileImage: string,
  publishedAt: Date
}

interface VideoInterface {
  _id: string,
  name:string,
  link:string,
  thumbnail:string,
  description:string,
  likes: number,
  views: number,
  channel: {
    id: string,
    name: string,
    avatar: string,
  },
  reviews: ReviewInterface[],
  publishedAt: Date,
  liked: boolean,
  subscribed: boolean,
  saved:boolean
}

function Video() {
  const { id } = useParams();
  const app = useContext<any>(AppContext);
  
  const { push } = useRouter()
  const [video, setVideo] = useState<VideoInterface>({
    _id: "",
  name:"",
  link:"",
  thumbnail:"",
  description:"",
  likes: 0,
  views: 0,
  channel: {
    id: "",
    name: "",
    avatar: "",
  },
  reviews: [{
    id: "",
    name:"",
    description: "",
    profileImage: "",
    publishedAt: new Date()
  }],
  publishedAt: new Date(),
  liked: false,
  subscribed: false,
  saved:false
  })
  const [comment, setComment] = useState("")

  const getVideo = async() =>{
    const response = await get(`video/${id}`);
    if(response.status === 200){
      setVideo({...response.data, likes:response.data.likes.length});
    } 
    else{
      console.error("Error getting video", `Status Code: ${response.status}`)
    }
    
  }

  const likeVideo = async() =>{

    if(!app.user) {
      push("/login");
      return;
    }
    await post(`video/like`,{videoId:id});
    if(video?.liked)
      setVideo((prev:VideoInterface)=>({...prev, likes:prev.likes-1, liked:false}))
    else
      setVideo((prev:VideoInterface)=>({...prev, likes:prev.likes+1, liked:true}))
  }

  const subscribeChannel = async() =>{

    if(!app.user) {
      push("/login");
      return;
    }
    await post(`channel/${video.channel.id}/subscribe`);
    if(video.subscribed){
      setVideo((prev:VideoInterface)=>({...prev, subscribed:false}))
    }
    else{
      setVideo((prev:VideoInterface)=>({...prev, subscribed:true}))
    }
  }

  const saveVideo = async() =>{

    if(!app.user) {
      push("/login");
      return;
    }
    
    await post(`video/${id}/save`);
    if(video.saved){
      setVideo((prev:VideoInterface)=>({...prev, saved:false}))
    }
    else{
      setVideo((prev:VideoInterface)=>({...prev, saved:true}))
    }
  }

  const sendComment = async() =>{
    if(!app.user) {
      push("/login");
      return;
    }
    const response = await post(`video/reply`,{videoId:id, name:app.user.name, profileImage:app.user.profileImage, review:comment});
    if(response.status === 200){
      toast({ title: "Successfully posted comment ✅"}) 
      const commentResponse = await get(`video/${id}/comments`);
      if(commentResponse.status === 200){
        setComment("")
        setVideo((prev:VideoInterface)=>({...prev, reviews:commentResponse.data}));
      } 
      else{
        console.error("Error getting comments", `Status Code: ${response.status}`)
      }
    } 
    else{
      toast({ title: "There was an error while posting your comment ❌", description:response.message}) 
      console.error("Error posting comment", `Status Code: ${response.status}`)
    }
  }

  const shareVideo = () => {
    navigator.share({
      url:window.location.href,
      title: video.name,
      text: video.description,
    })
  }

  useEffect(()=>{
    getVideo()
  },[])

  return (
    <div className="h-screen overflow-y-auto">
        <SearchBar/>
        {
          video.name &&
          <div className="grid grid-cols-12">
              <div className="col-span-12 h-screen p-5">
                <div className="flex items-center justify-center border border-gray-700 border-opacity-30 overflow-hidden rounded-md h-[450px]">
                  <video className="h-[450px]" src={video.link} controls autoPlay>
                  </video>
                </div>
                <p className=" text-white text-2xl py-2 font-semibold">{video.name}</p>
                <div className='mt-2 flex flex-wrap items-start gap-3'>
                  <div className='rounded-full flex justify-center items-center h-10 w-10'>
                    <Image 
                      src={video.channel.avatar}
                      height={Thumbnail.height}
                      width={Thumbnail.width}
                      alt=''
                      className='rounded-full flex justify-center items-center h-10 w-10'
                    />
                  </div>
                  <div className='flex h-full items-center justify-center flex-col'>
                    <p className=' text-white mt-2 text-md font-medium'>{video.channel.name}</p>
                    {/*<p className=' text-white text-sm text-opacity-50 font-medium'>{"121 subscribers"}</p>*/}
                  </div>
                  <div>
                    <Button onClick={subscribeChannel} variant={video.subscribed ? "outline" : "default"}>{video.subscribed ? "Subscribed!" : "Subscribe"}</Button>
                  </div>
                  <div className="lg:ml-auto mt-2 lg:mt-0 flex justify-between lg:justify-normal items-center gap-5">
                    <div className="flex border items-center border-gray-700 rounded-full overflow-hidden">
                      <Button onClick={likeVideo} className="bg-transparent hover:bg-transparent flex items-center">
                        <Heart className={video.liked ? "fill-white" : ""}/>
                        <p className="ml-2">{video.likes}</p>
                      </Button>
                      
                    </div>
                    <Button onClick={shareVideo} className="flex bg-transparent gap-3 border items-center border-gray-700 rounded-full overflow-hidden">
                      <Share2 />
                      Share
                    </Button>
                    <Button onClick={saveVideo} className="flex bg-transparent gap-3 border items-center border-gray-700 rounded-full overflow-hidden">
                      <Bookmark className={video.saved ? "fill-white" : ""}/>
                    </Button>
                  </div>
                </div>
                <div className="text-white text-sm mt-5 bg-white bg-opacity-10 p-4 rounded-md">
                  <p className="mb-2">{video.views} views  {} ago</p>
                  {video.description}
                </div>

                <div className="mt-8 pb-10">
                  <p className="text-white text-xl font-semibold">Comments</p>
                  <div className=" flex items-center mt-2 gap-2">
                    <Image
                          src={app.user?.profileImage || "https://res.cloudinary.com/dnwckxyyr/image/upload/b_rgb:FFFFFF/v1719059489/pgn4knhdevbig6xj1ugl.png"}
                          height={40}
                          width={40}
                          className="rounded-full"
                          alt="user"
                    />
                    <Input onChange={(e)=>setComment(e.target.value)} className="bg-transparent text-white border-none" placeholder="Add a comment..."/>
                    <Button onClick={sendComment} className="bg-white bg-opacity-5">
                      <SendHorizonal className="text-white"/>
                    </Button>
                  </div>
                  <hr className=" my-5 opacity-20"/>
                  {
                    video.reviews.length > 0 && video.reviews.map((review:ReviewInterface, i:number)=>(
                      <div key={i} className=" flex mb-6 text-white items-center gap-2">
                        <Image
                          src={review.profileImage || "https://res.cloudinary.com/dnwckxyyr/image/upload/b_rgb:FFFFFF/v1719059489/pgn4knhdevbig6xj1ugl.png"}
                          height={40}
                          width={40}
                          className="rounded-full"
                          alt="user"
                        />
                        <div>
                          <p className="text-sm font-semibold">{review.name}</p>
                          <p className="text-sm">{review.description}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              {/*
              <div className="hidden lg:block lg:col-span-4 py-5 pr-5">
                <div className="flex items-start">
                  <div className="border border-gray-700  rounded-md w-[40%] h-[90px]">

                  </div>
                  <div className="text-white ml-2">
                    <p>Why this video feels so DIFFERENT?</p>
                    <div className=''>
                      <p className=' text-white text-md text-opacity-70 font-medium mt-1 text-sm'>{"Channel name"}</p>
                      <p className=' text-white text-xs text-opacity-50 font-medium'>{"121 subscribers"}</p>
                    </div>
                  </div>
                </div>
                
              </div>
              */}
          </div>
        }
    </div>
  )
}

export default Video