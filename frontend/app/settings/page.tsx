"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormEvent, useContext, useEffect, useState } from "react"
import Image from "next/image"
import Thumbnail from '@/assets/thumbnail.jpg'
import { patch, patchFiles, post, postFiles } from "@/lib/api"
import { useRouter } from "next/navigation"
import { AppContext } from "@/components/interface/MainView"
import MegaPhone from "@/assets/megaphone.png"
import { logout } from "@/lib/auth"

export default function Component() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name:"",
        profileImage: new Blob()
    })
    const [password, setPassword] = useState({
      password:"",
      passwordConfirmation: ""
    })

    const app = useContext<any>(AppContext); 
   
    useEffect(()=>{
      if(app.user === undefined) return;
      
    },[app])

    const updateUser = async(e:FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      var formdata = new FormData()
      formdata.append("name", formData.name)
      formdata.append("profileImage", formData.profileImage)
      const response = await patchFiles(`user/update`,formdata);
  
      if(response.status === 200){
         app.getAcc()
         router.push("/");
      } 
      else{
        console.error("Error updating user", `Status Code: ${response.status}`)
      }
    }

    const changeUserPassword = async(e:FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if(password.password !== password.passwordConfirmation) return;

      const response = await patch(`user/update/password`,password);
  
      if(response.status === 200){
         app.getAcc()
         router.push("/");
      } 
      else{
        console.error("Error updating password", `Status Code: ${response.status}`)
      }
    }

  const signout = async() => {
    await logout()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 p-5 sm:px-10 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="bg-black border border-gray-700 rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-2xl font-bold ">Profile Settings</h2>
            <form onSubmit={updateUser} className="space-y-4">
              <div className=" relative border border-gray-700 p-5 flex items-center flex-col justify-center">
                <div className="flex  items-center space-x-4">
                  <Image 
                      src={formData.profileImage.size && URL.createObjectURL(formData.profileImage) || app?.user?.profileImage}
                      height={Thumbnail.height}
                      width={Thumbnail.width}
                      alt=''
                      className="w-36 h-36 mb-5 border border-gray-700 rounded-full"
                    />
                </div>
                <Label htmlFor="user-profile-image" className="text-xl">Profile Picture</Label>
                <Input id="user-profile-image" onChange={(e)=>setFormData((prev)=>({...prev, profileImage:e.target.files ? e.target.files[0] : new Blob()}))} className="absolute top-0 left-0 w-full opacity-0 h-full" type="file" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={app?.user?.name} onChange={(e)=>setFormData((prev)=>({...prev, name:e.target.value}))} className="bg-transparent border-gray-700 text-white" placeholder="Enter your name" />
              </div>
              
              <Button className="w-full" type="submit">
                Save Changes
              </Button>
            </form>
          </div>
          <div className="bg-black border border-gray-700 rounded-lg shadow-sm p-6 space-y-6 mt-5">
            <h2 className="text-xl font-bold ">Change Password</h2>
            <form onSubmit={changeUserPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" onChange={(e)=>setPassword((prev)=> ({ ...prev,password:e.target.value }))} className="bg-transparent border-gray-700 text-white" type="password" placeholder="Enter password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-confirmation">Password Confirmation</Label>
                <Input id="password-confirmation" onChange={(e)=>setPassword((prev)=> ({ ...prev,passwordConfirmation:e.target.value }))} className="bg-transparent border-gray-700 text-white" type="password" placeholder="Enter password confirmation" />
              </div>
              {password.password !== password.passwordConfirmation && <p className="text-orange-500">Passwords don&apos;t match</p>}
              <Button disabled={password.password !== password.passwordConfirmation} className="w-full bg-red-600" type="submit">
                Change
              </Button>
            </form>
          </div>
          <Button className="w-full mt-5" type="submit">
              Logout
          </Button>
        </div>
        <div className="bg-white w-full relative flex justify-center items-center dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ">
          <Image 
            src={MegaPhone.src}
            height={MegaPhone.height}
            width={MegaPhone.width-400}
            alt=""
            className="object-cover absolute h-full w-full"
          />
        </div>
      </main>
    </div>
  )
}
