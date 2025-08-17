import { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import { UserModel } from '@/model/User.model'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: " Email", type: "text", placeholder: "" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"username" | "password", string> | undefined): Promise<User | null> {
                if (!credentials) {
                    return null;
                }
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {
                                email: credentials.username
                            },
                            {
                                username: credentials.username
                            }
                        ]
                    })

                    if (!user) {
                        throw new Error('No User found with this email')
                    }
                    if (!user.isVerified) {
                        throw new Error('please verify your account before login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return {
                            id: user._id?.toString() ?? "",
                            username: user.username,
                            email: user.email,
                            password: user.password,
                            verifyCode: user.verifyCode,
                            verifyCodeExpiry: user.verifyCodeExpiry instanceof Date ? user.verifyCodeExpiry.getTime() : user.verifyCodeExpiry,
                            isVerified: user.isVerified,
                            isAcceptingMessages: user.isAcceptingMessage,
                            // message: user.message // Removed to match expected User type
                        }
                    }
                    else {
                        throw new Error('Incorrect password')
                    }
                }
                catch (error: unknown) {
                    if (error instanceof Error) {
                        throw new Error(error.message)
                    }
                    throw new Error('An unknown error occurred')
                }
            }

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString() ?? "";
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },


    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,

}