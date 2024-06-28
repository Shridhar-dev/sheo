"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { post } from "@/lib/api"
import { FormEvent, FormEventHandler, useContext, useState } from "react"
import login from "@/assets/login.png"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppContext } from "@/components/interface/MainView"
import { toast, useToast } from "@/components/ui/use-toast"

function SignInPage() {
  const [formData, setFormData] = useState({
    email:"", 
    password:"", 
  })
  const [error, setError] = useState(null)
  const { push } = useRouter();
  const { getAcc } = useContext<any>(AppContext); 
  
  const signin = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await post("user/login",formData)
    
    const name = await getAcc()
    if(name){
      toast({ title: "Successfully Signed In ✅", description: `${name} is the current active account`})  
      push("/")
    }
    else{
      setError(res.message)
    }
  }
  
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 py-12 gap-12 px-6 h-screen w-screen bg-white">
        <div className="flex flex-col justify-center px-10  border rounded-lg p-6 space-y-6">
            <p className="text-5xl border w-fit pb-3 rounded-md">📽️</p>
            <p className="text-3xl font-semibold mt-5">Sheo - Sign In</p>
            <p className="mt-1 mb-5 text-gray-700">Sharing Videos simplified ✨</p>
            <form onSubmit={signin} className="flex flex-col gap-5">            
                <Input onChange={(e)=>setFormData((prev)=>({...prev, email:e.target.value}))} required={true} type="email" placeholder="Enter email"  />
                <hr/>
                <Input onChange={(e)=>setFormData((prev)=>({...prev, password:e.target.value}))} required={true} type="password" placeholder="Enter password"  />
                {error && <p className="text-sm bg-orange-100 text-orange-600 p-2 rounded">{error}</p>}
                <Button type="submit">Sign In</Button>
                <Link href="/signup">Don&apos;t have an account? <span className="font-semibold">Create one</span></Link>
            </form>
            <p className=" text-gray-500 text-xs">By agreeing to create your account you agree to the terms and conditions of Sheo and consent to the Privacy Guidelines laid out in the privacy policy</p>

        </div>
        <div className=" overflow-hidden hidden md:flex items-center border rounded-lg space-y-6">
          <Image 
            src={login.src}
            height={login.height}
            width={login.width}
            className=" object-cover w-full"
            alt=""
          />
        </div>
    </section>
  )
}

export default SignInPage