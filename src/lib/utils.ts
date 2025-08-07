import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getStrapiURL(path = "") {
  return `${process.env.NEXT_PUBLIC_STRAPI_HOST || "http://127.0.0.1:1337"}${path}`
}