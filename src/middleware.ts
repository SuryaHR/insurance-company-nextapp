import { NextRequest, NextResponse } from "next/server";
import { i18n } from "@/i18n.config";
import { match as matchLocale } from "@formatjs/intl-localematcher"; // used to matching from list
import Negotiator from "negotiator"; // used to get request headers
import { cookies } from "next/headers";
import { getRoleBasedUrlList } from "./utils/helper";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}
export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  const url = req.nextUrl.clone();
  console.log("url", pathname);

  const noRoleCheckRoutes = [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/security",
    "/security-question",
  ];

  const tempLocale = pathname.trim().split("/")[1];
  let urlHasLocale = false;

  if (tempLocale.length === 2) {
    urlHasLocale = true;
  }
  if ((urlHasLocale && pathname === `/${tempLocale}`) || pathname == "/") {
    if (urlHasLocale) {
      url.pathname = `/${tempLocale}/login`;
    } else {
      url.pathname = "/login";
    }
    const redirect = NextResponse.redirect(url);
    if (tempLocale) {
      redirect.cookies.set("lang", tempLocale);
    }
    return redirect;
    // role based access
  } else if (
    pathname !== "/undefined" &&
    !noRoleCheckRoutes.includes(pathname) &&
    !pathname.includes("core-logic")
  ) {
    const userRole = cookieStore.get("role");
    const url = req.nextUrl.clone();
    if (
      userRole !== undefined &&
      userRole?.value &&
      accessToken !== undefined &&
      accessToken
    ) {
      console.log("userRole", userRole);
      const urlList = getRoleBasedUrlList(userRole?.value);
      if (urlList?.Screens) {
        const isUrlContain = urlList?.Screens?.some((screen) => {
          if (screen.URL.includes("{ID}")) {
            const screenUrl = screen.URL.split("/");
            const pathUrl = pathname.split("/");

            if (pathUrl.length === screenUrl.length) {
              let isValid = true;
              for (const i in screenUrl) {
                if (screenUrl[i] !== "{ID}" && screenUrl[i] !== pathUrl[i]) {
                  isValid = false;
                  break;
                }
              }
              return isValid;
            }
            return false;
          } else {
            return screen.URL === pathname;
          }
        });
        if (!isUrlContain) {
          console.log("isUrlContain", !isUrlContain);

          url.pathname = "/login";
          const redirect = NextResponse.redirect(url);
          redirect.cookies.set("accessDenied", "true");
          return redirect;
        }
      }
    } else {
      url.pathname = "/login";
      const redirect = NextResponse.redirect(url);
      redirect.cookies.set("accessDenied", "true");
      return redirect;
    }
  }

  /*------------For localization---------------*/
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale: string) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);
    if (urlHasLocale) {
      const newPathname = pathname.replace(`/${tempLocale}`, "");
      const rewrite = NextResponse.rewrite(
        new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${newPathname}`, req.url)
      );
      rewrite.cookies.set("lang", locale || "");
      return rewrite;
      // return NextResponse.rewrite(
      //   new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${newPathname}`, req.url)
      // );
    }
    const rewrite = NextResponse.rewrite(
      new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, req.url)
    );
    rewrite.cookies.set("lang", locale || "");
    return rewrite;
    // return NextResponse.rewrite(
    //   new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, req.url)
    // );
  }
  const res = NextResponse.next();
  res.cookies.set("lang", tempLocale || "");
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|assets|_next/image|favicon.ico).*)"],
};
