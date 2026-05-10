export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
      const isDashboardPage = pathname.startsWith("/dashboard") || 
                             pathname.startsWith("/trips") || 
                             pathname.startsWith("/profile") || 
                             pathname.startsWith("/search");
      
      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      if (isDashboardPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
  },
  providers: [], // We'll add providers in auth.js to keep it simple, or add edge-compatible ones here
};
