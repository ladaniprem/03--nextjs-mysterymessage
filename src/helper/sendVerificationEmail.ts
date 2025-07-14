import { resend } from "@/app/lib/resent";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail (
      email :  string,
      username: string,
      verifyCode: string
): Promise<ApiResponse>{
    try {
 await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Mystery message | Verify your email',
    react: VerificationEmail({ username:username, otp: verifyCode }),
  });
        return {
            success: true,
            message: "sucessfully to send verification email."
        };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email. Please try again later."
        };
        
    }
}