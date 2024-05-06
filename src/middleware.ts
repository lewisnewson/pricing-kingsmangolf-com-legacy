import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// App middleware for authentication and internationalization
export function middleware(request: NextRequest, response: NextResponse) {
	// Get the pathname and search parameters from the request
	const { pathname, search, protocol } = request.nextUrl
}

export const config = {
	matcher: [
		// Skip all internal paths, favicons and api endpoints
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
	],
}
