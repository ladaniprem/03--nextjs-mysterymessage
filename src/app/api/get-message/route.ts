import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/model/User.model";
import mongoose from "mongoose";


export async function GET(){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User // Note :- as User string without aggergation findbyid,findone their can handle it.

    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message : "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }
    // const userId = user._id; // Note :- Aggergation pipling me as User string vala issue face karna pad sakhta hai.
    //  aur hum dirctly  userId lete hai to paka hai ke code issues ayege.
   
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
            $match: {
                id:userId
            }
            },
            {
                $unwind : '$message'
            },
            {
                $sort:{
                    'message.createdAt': -1
                }
            },
            {
                $group:{
                    _id:'$_id',
                    messages: {
                        $push :'$messages'
                    }
                }
            }

        ])
        if(!user|| user.length===0){
            return Response.json(
                {
                    success:false,
                    message:"No Authenticated"
                },
                {
                    status : 401
                }
            )
        }

             return Response.json(
                {
                    success:true,
                    message:user[0].messages
                },
                {
                    status : 200
                }
            )
        }
     catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error fetching user data",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            {
                status: 500
            }
        );
    }
}