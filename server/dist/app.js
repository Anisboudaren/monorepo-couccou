"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const passport_1 = __importDefault(require("passport"));
const session_1 = require("./utils/session");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
require("./auth/passport");
const isProduction = process.env.NODE_ENV === "production";
const app = (0, express_1.default)();
isProduction ? app.set("trust proxy", 1) : "";
const allowedOrigins = [
    'http://localhost:3000', // dev frontend
    'https://coucou-client.vercel.app', // prod frontend
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        console.log("🌐 Request Origin:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn("❌ CORS blocked for origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
console.log(process.env.GOOGLE_CLIENT_ID);
console.log("✅ Session middleware applied");
app.use(session_1.sessionMiddleware);
console.log("✅ Passport initialized");
app.use(passport_1.default.initialize());
console.log("✅ Passport session attached");
app.use(passport_1.default.session());
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("API is up and running 🚀");
}));
const auth_middelware_1 = __importDefault(require("./utils/auth.middelware"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
app.use("/v1/auth", auth_routes_1.default);
const user_routes_1 = __importDefault(require("./routes/user.routes"));
app.use("/v1/user", auth_middelware_1.default, user_routes_1.default);
const agent_routes_1 = __importDefault(require("./routes/agent.routes"));
app.use("/v1/agent", auth_middelware_1.default, agent_routes_1.default);
const conversation_routes_1 = __importDefault(require("./routes/conversation.routes"));
app.use("/v1/conversation", conversation_routes_1.default);
const message_routes_1 = __importDefault(require("./routes/message.routes"));
app.use("/v1/message", message_routes_1.default);
exports.default = app;
