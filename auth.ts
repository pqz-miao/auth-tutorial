import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import { getUserByEmail, getUserById } from "@/data/user";

export const { 
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    providers: [Credentials({
        async authorize(credentials) {
            const validatedFields = LoginSchema.safeParse(credentials);

            if (validatedFields.success) {
                const { email, password } = validatedFields.data;

                const user = await getUserByEmail(email);
                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password,
                );

                if (passwordsMatch) return user;
            }

            return null;
        }
    })],
    callbacks: {
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            token.role = existingUser.role;

            return token;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            return session;
        },
    },
});
