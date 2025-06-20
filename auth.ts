import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

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
});
