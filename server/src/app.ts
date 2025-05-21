import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import { sessionMiddleware } from "./utils/session";
import cookieParser from "cookie-parser";


dotenv.config();
import "./auth/passport";

const app = express();

app.use(cors({
     origin: [
    'https://rag-chat-widget-test.vercel.app',
    'https://eclaire-dor.devlly.net',
    'http://localhost:3000' // local frontend
  ],
    methods: ['GET', 'POST', 'OPTIONS' , 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
console.log(process.env.GOOGLE_CLIENT_ID);

console.log("✅ Session middleware applied");
app.use(sessionMiddleware);

console.log("✅ Passport initialized");
app.use(passport.initialize());

console.log("✅ Passport session attached");
app.use(passport.session());




// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation Coucou",
            version: "1.0.0",
            description: "API documentation for your application",
        },
        servers: [
            {
                url: "http://localhost:3000", // Replace with your server URL
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", async (req, res) => {
    res.send("API is up and running 🚀");
});

import authenticateToken from "./utils/auth.middelware";

import authRoutes from "./auth/auth.routes";
app.use("/v1/auth", authRoutes);

import userRoutes from "./routes/user.routes";
app.use("/v1/user", authenticateToken, userRoutes);

import agentRoutes from "./routes/agent.routes";
app.use("/v1/agent", authenticateToken, agentRoutes);

import conversationRoutes from "./routes/conversation.routes";
app.use("/v1/conversation", conversationRoutes);

import messageRoutes from "./routes/message.routes";
app.use("/v1/message", messageRoutes);
export default app;