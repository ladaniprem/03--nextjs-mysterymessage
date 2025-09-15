import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists. Please choose a different username."
                },
                {
                    status: 400,
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({
            email: email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail?.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Email already exists. Please use a different email."
                },
                {
                    status: 400
                }
            )
        }
        else if (existingUserByEmail) {
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // Set expiry date to 1 hour from now
            await existingUserByEmail.save();
        }

        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)// Set expiry date

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    // message: "Registration successful! Please check your email to verify your account."
                    message: emailResponse.message
                },
                {
                    status: 500,
                }

            )
        }

        return Response.json(
            {
                success: true,
                message: "User registration successful! Please check your email to verify your account."
            },
            {
                status: 201,
            }
        )
    } catch (error) {
        console.error("Error during user registration:", error);
        return Response.json(
            {
                success: false,
                message: "An error occurred during registration. Please try again later."
            },
            {
                status: 500,
            }
        )
    }
}