import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "@/data/user";
import { db } from "./src/lib/db";
import authConfig from "./auth.config";


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth without email verification
            if(account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id || '')

            if(!existingUser?.emailVerified) return false
            return true
        },
        async session({ token, session }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as 'ADMIN' | 'USER'; // Assuming role is a field in your User model
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) {
                return token;
            }
            token.role = existingUser.role; // Assuming role is a field in your User model
            return token
        },
    },


    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})