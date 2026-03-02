import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowed = process.env.ALLOWED_EMAIL;
      if (!allowed) return false;
      return user.email === allowed;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      if (isDashboard) return isLoggedIn;
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
