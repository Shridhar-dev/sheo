"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { post } from "@/lib/api"
import { FormEvent, FormEventHandler, useContext, useState } from "react"
import login from "@/assets/login.png"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppContext } from "@/components/interface/MainView"
import { useToast } from "@/components/ui/use-toast"
import Logo from "@/assets/logo.png"
import Link from "next/link"

function SignUpPage() {
  const [formData, setFormData] = useState({
    name:"", 
    email:"", 
    profileImage:"", 
    password:"", 
    passwordConfirmation:""
  })
  const [error, setError] = useState(null)

  const { toast } = useToast()
  const { push } = useRouter();
  const { getAcc } = useContext<any>(AppContext); 
  let passwordCondition = formData.password !== formData.passwordConfirmation
  let condition = formData.name && formData.email && formData.password && formData.passwordConfirmation && !passwordCondition  ? false : true

  const signup = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(passwordCondition) return;
    const res = await post("user/signup",formData)

    const name = await getAcc()
    if(name){
      toast({ title: "Successfully Signed In ✅", description: `${name} is the current active account`})  
      push("/")
    }
    if(res.status !== 200){
      toast({ title: "There was an error signing you up ❌", description:res.message})  
      setError(res.message)
    }
  }
  
  return (
    <section className="grid grid-cols-2 gap-12 p-6 h-screen w-screen bg-white">
        <div className="flex flex-col col-span-2 lg:col-span-1 justify-center px-10 border rounded-lg space-y-6">
            <p className="text-5xl border w-fit p-3 flex items-center rounded-md">
              <Image
                src={Logo.src}
                height={40}
                width={40}
                alt=""
              />
            </p>
            <p className="text-3xl font-semibold mt-5">Sheo</p>
            <p className="mt-1 mb-5 text-gray-700">Sharing Videos simplified ✨</p>
            <form onSubmit={signup} className="flex flex-col gap-5">            
                <Input onChange={(e)=>setFormData((prev)=>({...prev, name:e.target.value}))} required={true} placeholder="Enter name"  />
                <Input onChange={(e)=>setFormData((prev)=>({...prev, email:e.target.value}))} required={true} type="email" placeholder="Enter email"  />
                <hr/>
                <Input onChange={(e)=>setFormData((prev)=>({...prev, password:e.target.value}))} required={true} type="password" placeholder="Enter password"  />
                <Input onChange={(e)=>setFormData((prev)=>({...prev, passwordConfirmation:e.target.value}))} required={true} type="password" placeholder="Enter password confirmation"  />
                {passwordCondition && <p className=" text-red-400 flex items-center gap-x-2 bg-orange-200 bg-opacity-20 p-2 rounded-md"> <AlertTriangle size={16} />passwords do not match</p>}
                {error && <p className="text-sm bg-orange-100 text-orange-600 p-2 rounded">{error}</p>}
                <Button type="submit" disabled={condition}>Sign Up</Button>
                <Link href="/login">Already have an account? <span className="font-semibold">Sign In</span></Link>
            </form>
        </div>
        <div className=" bg-black col-span-0 hidden md:flex lg:col-span-1 items-center border rounded-lg space-y-6 overflow-hidden">
          <Image 
            src={login.src}
            height={login.height}
            width={login.width}
            className=" object-cover w-full "
            alt=""
          />
        </div>
    </section>
  )
}

export default SignUpPage