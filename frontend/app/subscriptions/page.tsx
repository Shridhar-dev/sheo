"use client"

import { AppContext } from "@/components/interface/MainView";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

interface SubscriptionInterface {
    id:string,
    name:string,
    avatar:string,
}

function SubscriptionsPage() {
  const app = useContext<any>(AppContext); 
  
  return (
    <main className="text-white p-8">
        <p className="text-2xl font-semibold">Subscriptions</p>
        <p className="text-gray-500 mt-0.5">Explore all the channels you have subscribed to!</p>
        <div className="grid grid-cols-8 gap-10 mt-5">
            {
                app.user?.subscriptions.map((subscription:SubscriptionInterface, i:number)=>(
                    <Link key={i} href={`/channel/${subscription.id}`} className="flex flex-col items-center justify-center">
                        <Image 
                            src={subscription.avatar}
                            height={150}
                            width={150}
                            alt=""
                            className="rounded-full"
                        />
                        <p className="mt-2 text-lg">{subscription.name}</p>
                    </Link>
                ))
            }
            
            
        </div>
    </main>
  )
}

export default SubscriptionsPage