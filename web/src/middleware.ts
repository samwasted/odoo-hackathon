import NextAuth from "next-auth"

import authConfig from "../auth.config"

import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
  apiAuthPrefix
} from '../routes'

const {auth} = NextAuth(authConfig)
export default auth((req) => {
  const {nextUrl} = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if(isApiAuthRoute){
    return null
  }
  if(isAuthRoute){
    if(isLoggedIn){
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl))
    }
    return null
  }
  if(!isLoggedIn && !isPublicRoute){
    return Response.redirect(new URL('/auth/login', nextUrl))
  }
  return null
})

// invoke middleware on some paths, put in matcher
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)',
  ],
}