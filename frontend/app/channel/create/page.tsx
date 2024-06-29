"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormEvent, useContext, useEffect, useState } from "react"
import Image from "next/image"
import Thumbnail from '@/assets/thumbnail.jpg'
import { postFiles } from "@/lib/api"
import { useRouter } from "next/navigation"
import { AppContext } from "@/components/interface/MainView"
import MegaPhone from "@/assets/megaphone.png"
import { toast } from "@/components/ui/use-toast"

export default function Component() {
    const { push } = useRouter()
    const [formData, setFormData] = useState({
        name:"",
        description: "",
        avatar: new Blob()
    })
    const app = useContext<any>(AppContext); 
   
    useEffect(()=>{
      if(app.user === undefined) return;
      if(app.user === null) {
        push("/login");
        return;
      }
      else {
        if(app.user?.accountType ==="creator") push("/");
        return;
      }
    },[app])

    const editFormData = (field:string, value:string | File) => {
        setFormData((prev)=>({
          ...prev,
          [field]:value
        }))
    }

    const createChannel = async(e:FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      var formdata = new FormData()
      formdata.append("name", formData.name)
      formdata.append("description", formData.description)
      formdata.append("avatar", formData.avatar)
      
      if(formData.name === '' || formData.description === ''){
        toast({ title: "Please enter name and description❕", description: `Name and description are needed to create a channel`}) 
        return;
      }

      if(formData.avatar.type === ''){
        toast({ title: "Please upload an image❕", description: `An image is needed to create a channel`}) 
        return;
      }

      const response = await postFiles(`channel/create`,formdata);
  
      if(response.status === 200){
         app.getAcc()
         toast({ title: "Successfully created your channel ✅", description: `${formData.name} is your channel`})  
         push(response.link);
      } 
      else{
        toast({ title: "There was an error creating your Channel ❌", description: `${response.message}`})  
        console.error("Error creating channel", `Status Code: ${response.status}`)
      }
    }

  return (
    <div className="min-h-screen col-span-24 bg-black text-white flex flex-col">
      <main className="flex-1 px-10 mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-black border border-gray-700 rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-2xl font-bold ">Create your Channel</h2>
          <form onSubmit={createChannel} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel-name">Channel Name</Label>
              <Input id="channel-name" onChange={(e)=>editFormData("name", e.target.value)} className="bg-transparent border-gray-700 text-white" placeholder="Enter your channel name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel-description">Channel Description</Label>
              <Textarea id="channel-description" onChange={(e)=>editFormData("description", e.target.value)} className="bg-transparent border-gray-700 text-white" placeholder="Describe your channel" rows={3} />
            </div>
            <div className=" relative border border-gray-700 p-5 flex items-center flex-col justify-center">
              <div className="flex  items-center space-x-4">
                {
                  (formData.avatar.size && URL.createObjectURL(formData.avatar)) ?
                  <Image 
                    src={URL.createObjectURL(formData.avatar)}
                    height={Thumbnail.height}
                    width={Thumbnail.width}
                    alt=''
                    className="w-36 h-36 mb-5 border border-gray-700 rounded-full"
                  />
                  :
                  <div className="w-36 h-36 mb-5 border border-gray-700 rounded-full"></div>
                }
              </div>
              <Label htmlFor="channel-profile" className="text-xl">Channel Profile Picture</Label>
              <Input id="channel-profile" onChange={(e)=>editFormData("avatar", e.target.files && e.target.files[0] || "")} className="absolute top-0 left-0 w-full opacity-0 h-full" type="file" />
            </div>
            <Button className="w-full" type="submit">
              Create Channel
            </Button>
            <p className=" text-gray-500 text-xs">By agreeing to create your channel you agree to the terms and conditions of being a channel owner and consent to make your account a creator account</p>
          </form>
        </div>
        <div className="bg-white w-full relative hidden lg:flex justify-center items-center dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ">
          <Image 
            src={MegaPhone.src}
            height={MegaPhone.height}
            width={MegaPhone.width}
            alt=""
            className="object-cover absolute h-full w-full"
          />
        </div>
      </main>
    </div>
  )
}
