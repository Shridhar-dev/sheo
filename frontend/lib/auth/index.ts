import { get } from "../api"

export const getUser = async() =>{
    const res = await get("user")
    
    if(res.status === 202)
        return "logged out"
    return res
}

export const logout = async() =>{
    const res = await get("user/logout")
}