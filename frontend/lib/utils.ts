import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const sideUIpaths = ["/login", "/signup", "/video/create", "/channel/dashboard", "/channel/create"]
