import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import postRoutes from "./routes/postsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
// app.use(express.static("uploads"))
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const start = async() => {
    const connectDB = await mongoose.connect(process.env.MONGO_URI);

    app.listen(8080, () => {
        console.log(`Server is running on port ${8080}`);
    })
}

start();



