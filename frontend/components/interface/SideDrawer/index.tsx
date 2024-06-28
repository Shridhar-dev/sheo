"use client"
import { useEffect, useState } from "react"
import { Clock, Compass, Flame, Folder, Heart, History, Info, Menu, Plus, Settings, UserCheck } from "lucide-react"
import { usePathname } from "next/navigation"
import { sideUIpaths } from "@/lib/utils"
import Link from "next/link"
import Logo from "@/assets/logo.png"
import Image from "next/image"

function SideDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true)

  return (
    !sideUIpaths.includes(pathname) ?
    <nav data-open={open} className="peer [&>div]:data-[open=false]:px-3 [&>div]:data-[open=true]:px-5 col-span-0 lg:col-span-1 overflow-hidden  relative flex bg-black border-r border-white  border-opacity-20">
      <div className="text-white sticky top-0 w-full h-screen py-8">
          <Link href="/" className=" font-serif gap-2 w-full text-xl"> 
            <Image
              src={Logo.src}
              height={Logo.height}
              width={Logo.width}
              alt=""
            />
          </Link>
          <div className="mt-5">
            <div className="flex flex-col gap-5">
              <Link href={`/`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Compass className="min-w-[22px]"/></Link>
              <Link href={`/trending`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Flame className="min-w-[22px]"/></Link>
              <Link href={`/subscriptions`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Plus className="min-w-[22px]"/></Link>
              <div className="w-full h-[0.07px] bg-white bg-opacity-10"/>
              <Link href={`/saved`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Folder className="min-w-[22px]"/></Link>
              <Link href={`/history`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><History className="min-w-[22px]"/></Link>
              <Link href={`/liked`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Heart className="min-w-[22px]"/></Link>
              <div className="w-full h-[0.07px] bg-white bg-opacity-10"/>
              <Link href={`/settings`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Settings className="min-w-[22px]"/></Link>
              <Link href={`/info`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Info className="min-w-[22px]"/></Link>
            </div>
          </div>
      </div>
    </nav> :
    <></>
  )
}

export default SideDrawer