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
exports.deleteMessage = exports.updateMessage = exports.getAllMessages = exports.getMessageById = exports.createMessage = void 0;
const MessageServices = __importStar(require("../services/message.services"));
// Create Message
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield MessageServices.createMessage(req.body);
        res.status(201).json({
            success: true,
            message: "Message created successfully",
            data: message,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Message creation failed",
            data: null,
            error: error.message,
        });
    }
});
exports.createMessage = createMessage;
// Get Message by ID
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield MessageServices.getMessageById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Message retrieved successfully",
            data: message,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Message not found",
            data: null,
            error: error.message,
        });
    }
});
exports.getMessageById = getMessageById;
// Get All Messages
const getAllMessages = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield MessageServices.getAllMessages();
        res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            count: messages.length,
            data: messages,
            error: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            data: null,
            error: "Failed to fetch messages",
        });
    }
});
exports.getAllMessages = getAllMessages;
// Update Message
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedMessage = yield MessageServices.updateMessage(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: updatedMessage,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Message update failed",
            data: null,
            error: error.message,
        });
    }
});
exports.updateMessage = updateMessage;
// Delete Message
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield MessageServices.deleteMessage(req.params.id);
        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            data: null,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Message deletion failed",
            data: null,
            error: error.message,
        });
    }
});
exports.deleteMessage = deleteMessage;
