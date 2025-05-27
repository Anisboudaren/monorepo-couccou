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
exports.default = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ error: "No token, authorization denied" });
        }
        else {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                // Optionally fetch the full user data from DB
                const user = yield prisma_utils_1.default.user.findUnique({ where: { id: decoded.id } });
                if (!user) {
                    res.status(401).json({ error: "User not found" });
                }
                else {
                    req.user = user; // Attach user to request
                    next();
                }
            }
            catch (err) {
                res.status(403).json({ error: "Token is not valid" });
            }
        }
    });
}
