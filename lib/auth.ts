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
      const allowed = process.env.ALLOWED_EMAIL?.trim();
      if (!allowed) return false;
      const email = user?.email?.trim().toLowerCase();
      return email === allowed.toLowerCase();
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
