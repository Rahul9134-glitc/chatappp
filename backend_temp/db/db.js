import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const connectMongo = async() =>{
    try{
     
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo Db is Connected Sucessfully");

    }catch(error){
       console.log("Something went wrong when Connecting Mongo" , error);
    }
}



export default connectMongo;