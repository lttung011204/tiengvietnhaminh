import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import type { UserRole } from "@/types/database";

const intlMiddleware = createIntlMiddleware(routing);

const ROLE_HOME: Record<UserRole, string> = {
  admin: "admin",
  teacher: "teacher",
  parent: "parent",
  student: "student",
};

const PROTECTED_SECTIONS = new Set(["student", "parent", "teacher", "admin"]);

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const locale = (routing.locales as readonly string[]).includes(segments[0]) ? segments[0] : routing.defaultLocale;
  const section = segments[1];

  if (!PROTECTED_SECTIONS.has(section)) {
    return response;
  }

  const { user, role } = await updateSession(request, response);

  if (!user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (role && role !== "admin" && ROLE_HOME[role as UserRole] !== section) {
    return NextResponse.redirect(new URL(`/${locale}/${ROLE_HOME[role as UserRole]}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
