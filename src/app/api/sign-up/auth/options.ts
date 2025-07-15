import {Awaitable, NextAuthOptions, RequestInternal, User} from "next-auth"
import CredentialsProvider from "next-auth/providers/Credentials";
import bcrypt from 'bcryptjs'
import dbConnect from '@/app/lib/dbConnect'
import UserModel from '@/app/model/User.model'

 export const authOptions: NextAuthOptions =  {

    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                
            }
        })
    ]
 }