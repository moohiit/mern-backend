import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import userRoutes from "./routes/user.routes.js";
import { connectDb } from "./database/db.js";
configDotenv({});
//initialize the app
const app = express();

//Add middleware to app
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// cors options
app.use(
  cors({
    origin: process.env.ORIGIN_URL, // Allow requests from this origin
    credentials: true, // Enable credentials like cookies
  })
);



//api call here
app.use("/api/user", userRoutes);
//test route
app.get("/", (req, res) => {
  res.send("Hello from server");
})

//listen the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});
