"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Image as ImageIcon, Save, Upload, Video } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import Image from 'next/image'
import Thumbnail from '@/assets/thumbnail.jpg'
import { get, getCurrentUser, patchFiles, post, postFiles } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import { AppContext } from "@/components/interface/MainView"

export default function Component() {
  let formValues = new FormData()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail: new Blob() || "",
    video: new Blob() || "",
  })
  const app = useContext<any>(AppContext); 
  const { id } = useParams();
  
  useEffect(()=>{
    if(app.user === undefined) return;
    if(app.user === null) {
      router.push("/login");
      return;
    }
    else {
      if(!(app.user?.accountType ==="creator")) router.push("/");
      else{
        getVideo()
      }
    }
  },[app])

  const editFormData = (field:string, value:string | File) => {
    setFormData((prev)=>({
      ...prev,
      [field]:value
    }))
    formValues.set(field, value)
  }

  const updateVideo = async() => {
    var formdata = new FormData()
    formdata.append("name", formData.name)
    formdata.append("description", formData.description)
    formdata.append("thumbnail", formData.thumbnail)
    formdata.append("videoId", id as string)

    const response = await patchFiles(`video/update`,formdata);

    if(response.status === 200){
       router.push("/");
    } 
    else{
      console.error("Error updating video", `Status Code: ${response.status}`)
    }
  }

    const getVideo = async() =>{
        const response = await get(`video/${id}`);
        if(response.status === 200){
          if(response.data.channel.id !== app.user.channel){
            router.push("/");
            return;
          }
          setFormData({...response.data});
        } 
        else{
          console.error("Error getting video", `Status Code: ${response.status}`)
        }
    }


  return (
    <div className="grid grid-cols-12 w-full">
      <Card className="bg-black text-white col-span-12 lg:col-span-7 relative h-screen max-h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl">Edit your video details</CardTitle>
          <CardDescription>Quick edits to your video</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4">

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input value={formData.name} onChange={(e)=>editFormData("name", e.target.value || "" )} id="title" className="bg-black text-white border border-gray-700" placeholder="Enter the title of your video" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea value={formData.description} onChange={(e)=>editFormData("description", e.target.value || "" )} className="min-h-[100px] bg-black text-white border border-gray-700" id="description" placeholder="Enter the description of your video" />
          </div>
          <div className="grid grid-cols-2 w-full gap-2">
            <div className="relative">
              <Label>Thumbnail</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-24 h-24 rounded-lg border border-gray-700 dark:border-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className=" text-xs">
                  <p>
                    <strong>video-thumbnail.jpg</strong>
                  </p>
                  <p>1280x720 • .jpg</p>
                  <Button size="sm" className="mt-3">Upload Thumbnail</Button>
                </div>
                <Input onChange={(e)=>editFormData("thumbnail", e.target.files && e.target.files[0] || "" )} id="file" className="bg-black text-white absolute h-full opacity-0" type="file" />

              </div>
            </div>
          </div>
          <div className="mt-5">
            <Button onClick={updateVideo} className="w-full"><Save className="mr-2 h-4 w-4"/>Save</Button>
          </div>    
        </CardContent>
      </Card>
      <Card className="bg-black text-white hidden lg:block lg:col-span-5 h-screen sticky top-0">
        <CardHeader>
          <CardTitle className="text-xl">Preview</CardTitle>
          <CardDescription>How your video will be displayed</CardDescription>
        </CardHeader>
        <CardContent className="gap-4 pt-4">
                <div className="max-h-[400px] overflow-hidden">
                    <Image 
                        src={ formData.thumbnail.size && URL.createObjectURL(formData.thumbnail) || formData.thumbnail as unknown as string || Thumbnail.src}
                        height={200}
                        width={800}
                        alt=''
                    />
                </div>
              <p className=' mt-2 text-white text-xl font-medium'>{formData.name || "Title"}</p>
              <div className=' flex items-start gap-3'>
                <div className='rounded-full flex justify-center items-center h-10 w-10'>
                  <Image 
                    src={formData.thumbnail.size && URL.createObjectURL(formData.thumbnail) || Thumbnail.src}
                    height={Thumbnail.height}
                    width={Thumbnail.width}
                    alt=''
                    className='rounded-full flex justify-center items-center h-10 w-10'
                  />
                </div>
                <div className=''>
                  <p className=' text-white text-md text-opacity-50 font-medium'>{"Channel name"}</p>
                  <p className=' text-white text-sm text-opacity-50 font-medium'>100 subscribers</p>
                </div>
                
              </div>
              <div className="text-white text-sm mt-5 bg-white bg-opacity-10 p-4 rounded-md">
                  <p className="mb-2">{100} views &nbsp; {"1 day"} ago</p>
                  {formData.description}
              </div>
        </CardContent>
      </Card>
    </div>
  )
}

