import express from "express";
import cors from "cors"
import { ConnectDataBase } from "./db/ConnectDatabase.js";
import cookieParser from "cookie-parser";
import { config } from 'dotenv'
import authRouter from "./routes/auth.routes.js";

config({
  path: "./config/config.env"
})


const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}



const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


/** api */

app.use('/api/auth', authRouter);



ConnectDataBase().then(() => app.listen(process.env.PORT, () => {
  console.log(`Server is running ${process.env.PORT}...`)
}));



/** Error handle middleware */

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message
  })
})


