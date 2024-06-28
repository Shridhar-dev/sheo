import express, { Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import channelRouter from "./routes/channel.routes.js"
import 'dotenv/config'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = 8000

mongoose.connect(process.env.DB!).then((con)=>{
    console.log("CONNECTED TO DB SUCCESSFULLY!")
})

const app:Express = express()
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials:true
  }))


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter)
app.use("/video", videoRouter)
app.use("/channel", channelRouter)

app.listen(PORT,()=>{
  console.log(`SERVER STARTED AT PORT:${PORT}`)
})


export default app