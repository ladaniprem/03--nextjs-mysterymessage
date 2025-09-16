import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { UserModel } from "@/model/User.model";

export async function DELETE(_request:Request,{params}:{
    params: {messageid:string}}
){
    const messageId = params.messageid
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
    try {
        const updateResult = await UserModel.updateOne(
            {_id:user._id},
            {$pull: {messages:{_id:messageId}}}
        )
        if(updateResult.modifiedCount == 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already delete"
                },
                {
                    status: 404
                }
            )
        }
          return Response.json(
                {
                    success: true,
                    message: "Message deleted "
                },
                {
                    status: 200
                }
            )
    } catch (error) {
        console.log("error is delete message route",error)
          return Response.json(
                {
                    success: false,
                    message: `Error deleting message: ${error}`
                },
                {
                    status: 500
                }
            )
    }
    
}