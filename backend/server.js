import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


import postRoutes from "./routes/postsRoutes.js";
import userRoutes from "./routes/userRoutes.js";


import jobRoutes from "./routes/jobRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import settingsRoutes     from "./routes/settingsRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();


app.use(cors());
app.use(express.json());


app.use(postRoutes);
app.use(userRoutes);


app.use("/api/jobs", jobRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.all("/*splat", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

app.use(errorHandler);

app.use((err, req, res, next) => {
  const status  = err.statusCode || err.status || 500;
  const message = err.message    || "Internal server error";

  

  console.error(`[${req.method}] ${req.path} → ${status}: ${message}`);

  res.status(status).json({
    success: false,
    message,
  
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();