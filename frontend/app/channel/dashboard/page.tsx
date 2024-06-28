"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardHeader, CardContent, Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar, Play, Users, Video } from "lucide-react"
import { AppContext } from "@/components/interface/MainView";
import { useContext, useEffect, useState } from "react";
import { get } from "@/lib/api";
import { useRouter } from "next/navigation"
import Image from "next/image"
import VideoListTable from "@/components/interface/VideoListTable"

export default function Component() {
  const { push } = useRouter()
  const [channel, setChannel] = useState<any>({})
  const { user } = useContext<any>(AppContext); 
  
  const getChannel = async() =>{
    const response = await get(`channel/${user.channel}`);
    if(response.status === 200){
      setChannel(response.data);
    } 
    else{
      console.error("Error getting channel details", `Status Code: ${response.status}`)
    }
  }

  useEffect(()=>{
    if(user === undefined) return;
    if(user === null) {
        push("/login");
        return;
    }
    getChannel()
  }, [user])

  return (
    <div className=" bg-black  w-full  min-h-screen m-0 p-0">

      <main className="grid w-full max-h-screen overflow-y-auto grid-cols-24  gap-2 md:gap-4 ">
        <div className="flex flex-col col-span-24 lg:col-span-7 gap-2 sticky top-0 lg:h-screen md:pl-6 md:py-6">
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Card className="bg-black border-none text-white">
              <CardHeader className="p-4">
                <div className="flex items-center gap-2">
                  <Image
                    alt="Avatar"
                    className="rounded-full"
                    height={40}
                    src={channel.avatar}
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width={40}
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold">{channel.name}</div>
                    {/*<Button size="sm" variant="outline" className="text-black">
                      Upgrade to Pro
                  </Button>*/}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-1 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    Joined on {`
                      ${(new Date(channel.createdAt)).getDate()} /
                      ${(new Date(channel.createdAt)).getMonth()} /
                      ${(new Date(channel.createdAt)).getFullYear()}
                    `}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5" />
                    {channel.subscriberCount} Subscribers
                  </div>
                  <div className="flex items-center">
                    <Video className="w-4 h-4 mr-1.5" />
                    {channel.videoCount} Videos
                  </div>
                  <div className="flex items-center">
                    <Play className="w-4 h-4 mr-1.5" />
                    {channel.views} Views
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            {/*<Card className="bg-black text-white border-none">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Audience</CardTitle>
                <CardDescription>Summary of your audience demographics</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-1.5 text-sm">
                  <div className="flex items-center">
                    <div>Age 18-24</div>
                    <div className="ml-auto font-semibold">40%</div>
                  </div>
                  <div className="flex items-center">
                    <div>Age 25-34</div>
                    <div className="ml-auto font-semibold">30%</div>
                  </div>
                  <div className="flex items-center">
                    <div>Age 35-44</div>
                    <div className="ml-auto font-semibold">20%</div>
                  </div>
                  <div className="flex items-center">
                    <div>Age 45-54</div>
                    <div className="ml-auto font-semibold">7%</div>
                  </div>
                  <div className="flex items-center">
                    <div>Age 55-64</div>
                    <div className="ml-auto font-semibold">3%</div>
                  </div>
                </div>
              </CardContent>
            </Card>*/}
          </div>
          <Link href="/video/create" className="absolute bottom-20 right-5  shadow-white lg:static">
            <Button className="bg-white text-black hover:bg-white hover:text-black">+ Create New Video</Button>
          </Link>
        </div>
        <div className="grid gap-4 col-span-24 lg:col-span-17  md:pr-6 md:py-6 mt-5 lg:mt-0">
          <Card className="bg-black border border-gray-700 text-white">
            <CardHeader className="flex flex-row justify-center items-center gap-4 border-b md:gap-2">
              <div className="flex flex-col items-start md:flex-row md:items-center md:gap-1.5">
                <CardTitle className="text-base">Videos</CardTitle>
              </div>
              <Button className="ml-auto text-white" size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center justify-center">
              <VideoListTable videos={channel.videos}/>
            </CardContent>
          </Card>
          {/*
          <Card className="bg-black border border-gray-700 text-white">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b md:gap-2">
              <div className="flex flex-col items-start md:flex-row md:items-center md:gap-1.5">
                <CardTitle className="text-base">Total Views</CardTitle>
                <CardDescription className="text-sm">30 days performance</CardDescription>
              </div>
              <Button className="ml-auto text-black" size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-4xl font-semibold">1.2M</div>
              <CurvedlineChart className="w-full max-w-2xl aspect-[2/1]" />
            </CardContent>
          </Card>
          <Card className="bg-black border border-gray-700 text-white">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b md:gap-2">
              <div className="flex flex-col items-start md:flex-row md:items-center md:gap-1.5">
                <CardTitle className="text-base">Total Likes</CardTitle>
                <CardDescription className="text-sm">30 days performance</CardDescription>
              </div>
              <Button className="ml-auto text-black" size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-4xl font-semibold">23.5K</div>
              <CurvedlineChart className="w-full max-w-2xl aspect-[2/1]" />
            </CardContent>
          </Card>
          <Card className="bg-black border border-gray-700 text-white">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b md:gap-2">
              <div className="flex flex-col items-start md:flex-row md:items-center md:gap-1.5">
                <CardTitle className="text-base">Total Comments</CardTitle>
                <CardDescription className="text-sm">30 days performance</CardDescription>
              </div>
              <Button className="ml-auto text-black" size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-4xl font-semibold">12.3K</div>
              <CurvedlineChart className="w-full max-w-2xl aspect-[2/1]" />
            </CardContent>
          </Card>
                */}
        </div>
      </main>
    </div>
  )
}
