export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
      const isAdminPage = pathname.startsWith("/admin");
      const isDashboardPage = pathname.startsWith("/dashboard") || 
                             pathname.startsWith("/trips") || 
                             pathname.startsWith("/profile") || 
                             pathname.startsWith("/search");
      
      if (isAdminPage) {
        if (!isLoggedIn) return false;
        if (!auth.user.isAdmin) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

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
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
        session.user.isAdmin = token.isAdmin;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.username = user.username;
      }
      return token;
    },
  },
  providers: [], // We'll add providers in auth.js to keep it simple, or add edge-compatible ones here
};
