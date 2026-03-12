import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // রেসপন্স অবজেক্ট তৈরি
  let supabaseResponse = NextResponse.next({
    request,
  });

  // নতুন নিয়মে সুপাবেস ক্লায়েন্ট তৈরি
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ইউজারের সেশন চেক করা (সার্ভার সাইডে)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin");

  // ১. যদি লগইন করা না থাকে এবং ড্যাশবোর্ড বা অ্যাডমিনে যাওয়ার চেষ্টা করে
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ২. যদি ইউজার লগইন করা থাকে কিন্তু লগইন/সাইনআপ পেজে যাওয়ার চেষ্টা করে
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// কোন কোন লিঙ্কে এই দারোয়ান (Middleware) কাজ করবে সেটা বলে দেওয়া
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
