import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import RedditProvider from "next-auth/providers/reddit"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      authorization: {
        params: {
          duration: 'permanent',
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, user}) {
      session.user = user

      let userProfile = await prisma.profile.findUnique({
        where: {
          userId: session.user.id
        },
        include: {
          likedReviews: true,
          dislikedReviews: true,
        }
      });
      session.user.profile = userProfile
      return session
    }
  }
}

export default NextAuth(authOptions);