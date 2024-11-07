import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URL);
    if (response) {
      console.log("MongoDB connected..")
      console.log(`Host: ${response.connection.host}`)
    }
  } catch (error) {
    
  }
}