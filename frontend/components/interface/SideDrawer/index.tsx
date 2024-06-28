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
    <nav data-open={open} className="w-full absolute  bottom-0 z-[100] border-t lg:border-t-0 lg:relative col-span-0 lg:col-span-1 overflow-hidden   flex bg-black border-r border-white  border-opacity-20">
      <div className="text-white sticky top-0 w-screen lg:h-screen lg:py-8">
          <Link href="/" className=" font-serif hidden gap-2 w-full lg:flex items-center justify-center text-xl"> 
            <Image
              src={Logo.src}
              height={30}
              width={30}
              alt=""
            />
          </Link>
          <div className="lg:mt-5">
            <div className="flex lg:flex-col gap-5">
              <Link href={`/`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Compass className="min-w-[22px]"/></Link>
              <Link href={`/trending`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Flame className="min-w-[22px]"/></Link>
              <Link href={`/subscriptions`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Plus className="min-w-[22px]"/></Link>
              <div className="lg:w-full hidden lg:block h-[0.07px] bg-white  lg:bg-opacity-10"/>
              <Link href={`/saved`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Folder className="min-w-[22px]"/></Link>
              <Link href={`/history`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><History className="min-w-[22px]"/></Link>
              <Link href={`/liked`} className="w-full flex items-center justify-center gap-4 py-3 hover:text-opacity-100 px-2 rounded-md text-white text-opacity-60"><Heart className="min-w-[22px]"/></Link>
              <div className="lg:w-full hidden lg:block h-[0.07px] bg-white lg:bg-opacity-10"/>
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