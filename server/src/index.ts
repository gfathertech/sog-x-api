import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import morgan from 'morgan';
import cors from "cors"
import cookieParser from "cookie-parser";
import { v1Routes } from "./routes/v1Route";


import authRouter from "./auth/userRoutes";

import { morganStream, logger } from "./config/logger";
import { db } from "./config/db";
// import passport from "passport";
// import setupPassport from "./auth/config/passport";


dotenv.config()
const app: Express = express()

const PORT: number = parseInt(process.env.PORT || '7860', 10)
db()
// Middleware
// app.use(passport.initialize());
// setupPassport();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined", { stream: morganStream }));


app.get('/', (req: Request, res: Response) => {
    res.json({
        status: '200',
        data: 'Backend is responding'
    })
})


// Routes
app.use("/api/auth", authRouter);
v1Routes(app)

// 404 Handler
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

// Error handler
app.use((err: any, req: any, res: Response, next: any) => {
  logger.error(`Server error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});


app.listen(PORT, ()=> {
    console.info(`Server has started!!!! at http://localhost:${PORT}`
        
    )
})
