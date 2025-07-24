import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number;
}

export const connection: ConnectionObject = {};

 async function dbConnect(): Promise<void> {
   if (connection.isConnected) {
       console.log("Using existing database connection");
       return;
    }

try {
   const db =  await mongoose.connect(process.env.MONGODB_URI as string || '',{})
   
   connection.isConnected = db.connection.readyState
   console.log("Database connected successfully:", connection.isConnected);
   // console.log(db);
   
}

 catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to the database");
    //  process.exit(1);
}

   }
export default dbConnect;