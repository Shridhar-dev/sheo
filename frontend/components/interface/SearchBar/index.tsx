'use client'
import { ArrowUpRight, Bell, Grid2X2, LogIn, Mic } from 'lucide-react'
import { Input } from "@/components/ui/input"
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { AppContext } from '../MainView'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { get, getCurrentUser, post } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import VoiceInput from '../VoiceInput'

const creatorLinks = [
  {
    name:"Settings",
    link:"/settings",
  },
  {
    name:"Dashboard",
    link:"/channel/dashboard",
  },
]

const consumerLinks = [
  {
    name:"Settings",
    link:"/settings",
  },
  {
    name:"Create your Channel",
    link:"/channel/create",
  },
]

function SearchBar() {
  const app = useContext<any>(AppContext);
  
  const [search, setSearch] = useState("")
  const [videos, setVideos] = useState<[{_id:string, name:""}] | []>([])
 

  const signout = async() => {
    await logout()
    window.location.reload()
  }

  const searchVideos = async() => {
    const response = await get(`video/search?search=${search}`)
    if(response.status === 200){
      setVideos(response.data)
    } 
    else{
      console.error("Error creating channel", `Status Code: ${response.status}`)
    }
  }

  useEffect(() => {
    if(search === "") { setVideos([]); return;}
    searchVideos()
  }, [search])
  
 

  return (
    <div className='py-5 px-8 sticky top-0 bg-black z-10 flex items-center gap-5 border-b border-white border-opacity-20'>
      <div>
        <VoiceInput setSearch={setSearch}/>
      </div>
      <div className='relative flex-1'>
        <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Type to Search"  className='bg-transparent border-0 text-white'/>
        {
          videos.length > 0 &&
          <div className='bg-[#0b0b0b] w-full flex flex-col gap-2 absolute top-[160%] rounded-md left-0 py-3 text-white'>
            {
              videos.map((video,i)=>(
                <Link key={i} className='px-5 py-2 hover:bg-gray-700 hover:bg-opacity-30' href={`/video/${video._id}`}>
                  <p>{video.name}</p>
                </Link>
              ))
            }
          </div>
        }
      </div>
      {
        app.user &&
        <div className='overflow-hidden min-h-8 min-w-8 h-8 w-8 relative'>
          <DropdownMenu>
            <DropdownMenuTrigger className='h-8 w-8'>
              <div className='relative'>
                <Bell className=' text-white text-opacity-50'/>
                {/*<div className='bg-blue-500 absolute -top-0.5 right-2.5 text-white text-[0.5rem] h-2 w-2 rounded-full flex items-center justify-center overflow-hidden'></div>*/}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='left' className='bg-black text-white border-gray-700 mt-2 mr-2'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/*<DropdownMenuItem className='text-gray-200 flex flex-col items-start border-b'>
                <p>Channeler posted a new video</p>
                <p className='text-[0.8rem] text-gray-300'>Channeler posted a new video</p>
              </DropdownMenuItem>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
      {
        app.user &&
        <div className='bg-white rounded-full overflow-hidden min-h-8 min-w-8 h-8 w-8 relative'>
          <DropdownMenu>
            <DropdownMenuTrigger className='h-8 w-8'>
              <Image 
                src={app.user.profileImage}
                height={100}
                width={100}
                alt=""
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-black text-white border-gray-700 mt-2 mr-2'>
              <DropdownMenuLabel>{app.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {
                app.user.accountType === "consumer" ?
                consumerLinks.map((link,i)=><Link key={i} href={link.link}><DropdownMenuItem className='text-gray-200'>{link.name}</DropdownMenuItem></Link>)
                :
                creatorLinks.map((link,i)=><Link key={i} href={link.link}><DropdownMenuItem className='text-gray-200'>{link.name}</DropdownMenuItem></Link>)
              }
              {app.user.accountType !== "consumer"  && <Link href={`/channel/${app.user.channel}`}><DropdownMenuItem className='text-gray-200'>Channel</DropdownMenuItem></Link>}
              <DropdownMenuItem onClick={signout} className='text-gray-200'>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
      {
        !app.user &&
        <Link href="/login" className='text-white flex rounded-md text-sm py-2 px-5'>
          <LogIn className='h-5 w-5'/>
        </Link>
      }
    </div>
  )
}

export default SearchBar