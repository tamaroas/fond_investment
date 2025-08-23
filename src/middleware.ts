import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { headers } from 'next/headers';

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator';
import { langsConfig } from './utils/langs-config';

function getLocale(request: NextRequest): string | undefined {

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const langs: string[] = langsConfig.langs

  // Use negotiator and intl-localematcher to get best lang
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(langs)

  return matchLocale(languages, langs, langsConfig.defaultLang)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.search;

  // Redirect root path to login page
  if (pathname === '/'||pathname === '/fr' || pathname === '/en') {
    const lang = getLocale(request);
    const loginUrl = new URL(`/${lang}/login`, request.nextUrl);
    return NextResponse.redirect(loginUrl + searchParams);
  }

  // Check if there is any supported lang in the pathname
  const pathnameIsMissingLocale = langsConfig.langs.every(
    (lang) => !pathname.startsWith(`/${lang}`) && pathname !== `/${lang}`
  )
  // Redirect if there is no lang
  if (pathnameIsMissingLocale) {
    let lang
    let newUrl
    let langPath = pathname.split("/")[1].split("-")["0"].toLocaleLowerCase()

    /* 
     reecriture pour les url de  la forme fr-FR, en-EN
          /en-US/products redirige vers /en/products
          /en-US/products redirige vers /en/products
    */

    if (langsConfig.langs.find((lang) => lang == langPath)) {
      lang = langPath
      const pathRewite = pathname.slice(6)
      newUrl = new URL(`/${lang}${'/'}${pathRewite}`, request.nextUrl)
    } else {
      lang = getLocale(request)
      newUrl = new URL(`/${lang}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.nextUrl)
    }

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(newUrl + searchParams)
  }

}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|assets|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}