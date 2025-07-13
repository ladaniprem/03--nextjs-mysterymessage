import mongoose, { Schema,Document} from "mongoose";


 export interface Message extends Document { 
    content : string, // typescript me string lower letters me write it.
    createdAt : Date,
}

export const MessageSchema:Schema<Message> = new Schema({
    content : {
        type: String, // mongoose me string upper letters me write it.
        required: true,
    },
    createdAt :{
     type: Date,
     required: true,
     default: Date.now, // default value for createdAt is current date and time
    },

})


 export interface User extends Document { 
    username : string, // typescript me string lower letters me write it.
    email : string ,
    password : string,
    verifyCode : string,
    verifyCodeExpiry : Date ,
    isVerified : boolean,
    isAcceptingMessage : boolean,
    message : Message[],
}

export const UserSchema:Schema<User> = new Schema({
      username : {
        type: String, // mongoose me string upper letters me write it.
        required: [true,"username is required"], // custom error message
        unique: true, // username should be unique
        trim: true, // remove extra spaces from username
      },
      email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address"
    ]
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
      },
      verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"],
      },
       isVerified: {
        type : Boolean,
        default: false, // default value for isVerified is false
       },
       isAcceptingMessage: {
        type : Boolean,
        default: true, // default value for isAcceptingMessage is true
       },
       message: [MessageSchema]
})

export const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema)
