import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

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

import userRoutes from "./routes/user.routes";
app.use("/v1/user", userRoutes);

import agentRoutes from "./routes/agent.routes";
app.use("/v1/agent", agentRoutes);

export default app;