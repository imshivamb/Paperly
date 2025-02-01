import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient()


declare module "next-auth" {
    interface Session {
      user: {
        id: string;
      } & DefaultSession["user"]
    }
  
    interface User {
      id: string;
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id?: string;
    }
  }
  
  export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
    ],
    callbacks: {
      async session({ token, session }) {
        if (token && session.user) {
          session.user.id = token.id as string
          session.user.name = token.name
          session.user.email = token.email
          session.user.image = token.picture
        }
  
        return session
      },
      async jwt({ token, user }) {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: token.email as string,
          },
        })
  
        if (!dbUser) {
          if (user) {
            token.id = user?.id
          }
          return token
        }
  
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          picture: dbUser.image,
        }
      },
    },
  }