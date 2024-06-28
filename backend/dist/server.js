import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const PORT = 8000;
mongoose.connect(process.env.DB).then((con) => {
    console.log("CONNECTED TO DB SUCCESSFULLY!");
});
app.listen(PORT, () => {
    console.log(`SERVER STARTED AT PORT:${PORT}`);
});
