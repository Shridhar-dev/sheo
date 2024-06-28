const API_URL = "http://127.0.0.1:8000"

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export const post = async(endpoint:string, body={}) => {
  if(!localStorage) return;
  
  const raw = JSON.stringify(body);
    
  const requestOptions:any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    credentials: 'include'
  };
    
  try{
    const response = await fetch(`${API_URL}/${endpoint}`, requestOptions)
    const res  = await response.json()
    return res
  }
  catch(e:any){
    throw Error(e)
  }
}

export const patch = async(endpoint:string, body={}) => {
  const raw = JSON.stringify(body);

  const requestOptions:any = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    credentials: 'include'
  };
    
  try{
    const response = await fetch(`${API_URL}/${endpoint}`, requestOptions)
    const res  = await response.json()
    return res
  }
  catch(e:any){
    throw Error(e)
  }
}

export const postFiles = async(endpoint:string, formData:any) => {
  if(!localStorage) return;
  const jwt = localStorage.getItem("sheo-jwt")

  if(jwt) myHeaders.append("Authorization",`Bearer ${jwt}`);
  myHeaders.delete("Content-type")
  const requestOptions:any = {
    method: "POST",
    headers: myHeaders,
    body: formData, 
    credentials: 'include'
  };
  
  try{
    const response = await fetch(`${API_URL}/${endpoint}`, requestOptions)
    const res  = await response.json()
    return res
  }
  catch(e:any){
    throw Error(e)
  }
}

export const patchFiles = async(endpoint:string, formData:any) => {
  if(!localStorage) return;
  const jwt = localStorage.getItem("sheo-jwt")

  if(jwt) myHeaders.append("Authorization",`Bearer ${jwt}`);
  myHeaders.delete("Content-type")

  const requestOptions:any = {
    method: "PATCH",
    headers: myHeaders,
    body: formData, 
    credentials: 'include'
  };
  
  try{
    const response = await fetch(`${API_URL}/${endpoint}`, requestOptions)
    const res  = await response.json()
    return res
  }
  catch(e:any){
    throw Error(e)
  }
}

export const get = async(endpoint:string) => {
  if(!localStorage) return;
  const jwt = localStorage.getItem("sheo-jwt")
  let requestOptions:any = {credentials: 'include'};
  
  if(jwt)
    requestOptions = {credentials: 'include', headers: {...myHeaders} };
    
  try{
    const response = await fetch(`${API_URL}/${endpoint}`, requestOptions)
    
    const data = await response.json()
    return data
  }
  catch(e:any){
    console.log(e)
    throw Error(e)
  }
}

export const getCurrentUser = () => {
  if(!localStorage) return;
  const jwt = localStorage.getItem("sheo-jwt")
  const user = localStorage.getItem("sheo-user")

  if(jwt && user){
    return (
      {
        token:jwt,
        user:JSON.parse(user)
      }
    )
  }
  else{
    return (
      {
        token:null,
        user:null
      }
    )
  }
}