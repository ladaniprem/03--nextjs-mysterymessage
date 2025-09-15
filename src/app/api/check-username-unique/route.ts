import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { z } from "zod";
import {usernameValidation} from '@/schemas/signUpSchema'


const UsernameQuerySchema  = z.object({
    username : usernameValidation
})

export async function GET(request:Request){
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //valid with the zod
     const result = UsernameQuerySchema.safeParse(queryParam)
     // console.log(result) // TODO: remove 
     if(!result.success){
        // Use format() to get error details
        const formatted = result.error.format();
        const usernameErrors = formatted.username?._errors;
        return Response.json(
            {
                success: false,
                message: usernameErrors && usernameErrors.length > 0
                    ? usernameErrors.join(', ')
                    : 'Invalid query Parameters',
                errors: usernameErrors
            },
            { status: 400 }
        );
     }

     const { username } = result.data!;

     // Check if the username already exists in the database
     const existingUser = await UserModel.findOne({ username, isVerified:true });

     if (existingUser) {
         return Response.json(
             {
                 success: false,
                 message: "Username is already taken"
             },
             { status: 409 }
         );
     }

     return Response.json(
         {
             success: true,
             message: "Username is available"
         },
         { status: 200 }
     );
    } catch (error) {
        console.error("error checking username",error)
        return Response.json(
             {
                 success: false,
                 message: "error checking username"
             },
             {status:500}
    )
    }
}