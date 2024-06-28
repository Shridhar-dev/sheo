//@ts-nocheck
"use client"
import { getUser } from '@/lib/auth';
import { sideUIpaths } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React, { ReactChildren, ReactNode, createContext, useEffect } from 'react'
import { useState } from 'react';

let AppContext = createContext({user:null, setUser:()=>{}})


function MainView({children}:IntrinsicAttributes & ReactNode) {
  const pathname = usePathname();
  const [user, setUser] = useState<undefined | null | any>(undefined)

  const getAcc = async() => {
    const user = await getUser()
    if(user.status === 200){
      setUser(user.data)
      return user.data.name;
    }
  }

  useEffect(()=>{
    getAcc()
  },[])

  return (
    <>
    <AppContext.Provider value={{user, getAcc}}>
      {
        !sideUIpaths.includes(pathname) ?
        <main className="col-span-24 lg:col-span-23 bg-black h-screen overflow-y-auto">
            {children}
        </main>
        :
        <>{children}</>
      }
    </AppContext.Provider>
    </>
  )
}

export default MainView
export { AppContext } 