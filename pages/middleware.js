import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (!req.nextUrl.locale) {
    const locale = req.cookies.get('NEXT_LOCALE') || 'en-US'

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}

export { default } from "next-auth/middleware"

export const config = { 
    matcher: [
        "/dashboard/:path*"
    ] 
}