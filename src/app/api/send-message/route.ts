import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request:Request){
  await dbConnect()

  const {username,content} = await request.json()

  try{
   const user = await UserModel.findOne({username})
   if(!user){
    return Response.json(
                {
                    success:false,
                    message:"User Not Found "
                },
                {
                    status : 404
                }
            )
        }
        if(!user.isAcceptingMessage){
         return Response.json(
                {
                    success:false,
                    message:"User is not Accepting the messages "
                },
                {
                    status : 403
                }
            )
        }
        const newMessage = { content, createdAt: new Date() }
        user.message.push(newMessage as Message)
        await user.save()

          return Response.json(
      {
        success: true,
        message: "Message send Successfully"
      },
      {
        status: 401
      }
    )
        
        }
  catch(error){
    return Response.json(
      {
        success: false,
        message: `Error processing request: ${error}`
      },
      {
        status: 500
      }
    )
  }
}
