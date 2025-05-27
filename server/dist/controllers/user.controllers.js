"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.getUserAgents = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.createUser = void 0;
const UserServices = __importStar(require("../services/user.services"));
// Create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServices.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "User creation failed",
            data: null,
            error: error.message,
        });
    }
});
exports.createUser = createUser;
// Get User by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserServices.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "User not found",
            data: null,
            error: error.message,
        });
    }
});
exports.getUserById = getUserById;
// Get All Users
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserServices.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            count: users.length,
            data: users,
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            data: null,
            error: "Failed to fetch users",
        });
    }
});
exports.getAllUsers = getAllUsers;
// Update User
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield UserServices.updateUser(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "User update failed",
            data: null,
            error: error.message,
        });
    }
});
exports.updateUser = updateUser;
// Delete User
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserServices.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "User deletion failed",
            data: null,
            error: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
// Get User Agents
const getUserAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const agents = yield UserServices.getUserAgents(userId);
        res.status(200).json({
            success: true,
            message: "Agents retrieved successfully for user",
            count: agents.length,
            data: agents,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Could not retrieve agents for user",
            data: null,
            error: error.message,
        });
    }
});
exports.getUserAgents = getUserAgents;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "User not found",
            data: null,
            error: error.message,
        });
    }
});
exports.getMe = getMe;
