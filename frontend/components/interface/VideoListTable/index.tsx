import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import Image from "next/image"
import { useRouter } from "next/navigation"
  
  export default function VideoListTable({videos}:any) {
    const { push } = useRouter()

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className=" w-[100px]">Views</TableHead>
            <TableHead className="text-left w-[100px]">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b border-white">
          {videos?.map((video:any, i:number) => (
            <TableRow className=" hover:cursor-pointer" onClick={()=>push(`/channel/dashboard/video/${video._id}`)} key={i}>
              <TableCell className="font-medium">
                <Image
                  src={video.thumbnail}
                  height={200}
                  width={200}
                  alt=""
                />
              </TableCell>
              <TableCell>{video.name}</TableCell>
              <TableCell className="">{video.views}</TableCell>
              <TableCell className="text-left">{video.likes.length}</TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    )
  }
  