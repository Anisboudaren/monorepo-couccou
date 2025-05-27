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
exports.getUserAgents = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.createUser = void 0;
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, username, settings } = data;
    if (!email || !password || !role || !username) {
        throw new Error("Missing required fields");
    }
    const existingUser = yield prisma_utils_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield prisma_utils_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            username,
            settings,
        },
    });
    return newUser;
});
exports.createUser = createUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_utils_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            settings: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
exports.getUserById = getUserById;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_utils_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            settings: true,
            createdAt: true,
            updatedAt: true,
        },
    });
});
exports.getAllUsers = getAllUsers;
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.password) {
        data.password = yield bcrypt_1.default.hash(data.password, 10);
    }
    try {
        const updatedUser = yield prisma_utils_1.default.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                settings: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    catch (error) {
        throw new Error("User not found or update failed");
    }
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_utils_1.default.user.delete({ where: { id } });
        return true;
    }
    catch (error) {
        throw new Error("User not found or delete failed");
    }
});
exports.deleteUser = deleteUser;
const getUserAgents = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const agents = yield prisma_utils_1.default.agent.findMany({
        where: {
            userId: userId,
        },
    });
    return agents;
});
exports.getUserAgents = getUserAgents;
