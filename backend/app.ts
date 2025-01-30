import express, { Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import channelRouter from "./routes/channel.routes.js"

const app:Express = express()

let whitelist = ['https://sheo.vercel.app']

app.use(cors({
    origin: whitelist[0],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials:true
}))


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter)
app.use("/video", videoRouter)
app.use("/channel", channelRouter)

export default app