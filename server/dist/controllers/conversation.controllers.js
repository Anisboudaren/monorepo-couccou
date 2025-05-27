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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationHistoryController = exports.sendMessageController = exports.handleAgentReply = exports.addMessageToConversationController = exports.initiateConversationController = exports.deleteConversation = exports.updateConversation = exports.getConversationsByAgent = exports.getAllConversations = exports.getConversationById = exports.createConversation = void 0;
const ConversationServices = __importStar(require("../services/conversation.services"));
const conversation_services_1 = require("../services/conversation.services");
const deepseek_services_1 = require("../services/deepseek.services");
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
// Create Conversation
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield ConversationServices.createConversation(req.body);
        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            data: conversation,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Conversation creation failed",
            data: null,
            error: error.message,
        });
    }
});
exports.createConversation = createConversation;
// Get Conversation by ID
const getConversationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield ConversationServices.getConversationById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Conversation retrieved successfully",
            data: conversation,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Conversation not found",
            data: null,
            error: error.message,
        });
    }
});
exports.getConversationById = getConversationById;
// Get All Conversations
const getAllConversations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversations = yield ConversationServices.getAllConversations();
        res.status(200).json({
            success: true,
            message: "Conversations retrieved successfully",
            count: conversations.length,
            data: conversations,
            error: null,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch conversations",
            data: null,
            error: "Failed to fetch conversations",
        });
    }
});
exports.getAllConversations = getAllConversations;
// Get Conversations by Agent
const getConversationsByAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req.params.agentId;
        const conversations = yield ConversationServices.getConversationsByAgent(agentId);
        res.status(200).json({
            success: true,
            message: "Conversations retrieved successfully for agent",
            count: conversations.length,
            data: conversations,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Could not retrieve conversations for agent",
            data: null,
            error: error.message,
        });
    }
});
exports.getConversationsByAgent = getConversationsByAgent;
// Update Conversation
const updateConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedConversation = yield ConversationServices.updateConversation(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Conversation updated successfully",
            data: updatedConversation,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Conversation update failed",
            data: null,
            error: error.message,
        });
    }
});
exports.updateConversation = updateConversation;
// Delete Conversation
const deleteConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ConversationServices.deleteConversation(req.params.id);
        res.status(200).json({
            success: true,
            message: "Conversation deleted successfully",
            data: null,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Conversation deletion failed",
            data: null,
            error: error.message,
        });
    }
});
exports.deleteConversation = deleteConversation;
// Initiate Anonymous Conversation
const initiateConversationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentId, firstMessage } = req.body; // Assuming agentId and firstMessage are sent in the body
    if (!agentId || !firstMessage) {
        res.status(400).json({ error: "AgentId and firstMessage are required" });
    }
    try {
        const conversation = yield (0, conversation_services_1.initiateAnonymousConversation)({ agentId, firstMessage });
        res.status(201).json(conversation);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while initiating the conversation." });
    }
});
exports.initiateConversationController = initiateConversationController;
// Add Message to Conversation
const addMessageToConversationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, isFromAgent, message } = req.body; // Assuming you pass conversationId, isFromAgent, and message in the request body
    if (!conversationId || !message) {
        res.status(400).json({ error: "ConversationId and message are required" });
    }
    try {
        const { conversation, newMessage } = yield (0, conversation_services_1.addMessageToConversation)({
            conversationId,
            isFromAgent,
            message,
        });
        res.status(200).json({ conversation, newMessage });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while adding the message." });
    }
});
exports.addMessageToConversationController = addMessageToConversationController;
const handleAgentReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.body;
    if (!conversationId) {
        res.status(400).json({ error: "conversationId is required" });
    }
    else {
        try {
            // 1. Get assistant response
            const reply = yield (0, deepseek_services_1.getAgentResponseFromDeepSeek)({ conversationId });
            // 2. Save reply as a message from agent
            const newMessage = yield prisma_utils_1.default.message.create({
                data: {
                    conversationId,
                    isFromAgent: true,
                    message: reply,
                },
            });
            res.status(200).json({ reply: newMessage });
        }
        catch (error) {
            console.error("DeepSeek error:", error);
            res.status(500).json({ error: "Failed to get agent response" });
        }
    }
});
exports.handleAgentReply = handleAgentReply;
const sendMessageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, message } = req.body;
    if (!conversationId || !message) {
        res.status(400).json({ error: "conversationId and message are required" });
    }
    else {
        try {
            // 1. Save user message to DB
            const userMessage = yield prisma_utils_1.default.message.create({
                data: {
                    conversationId,
                    isFromAgent: false,
                    message,
                },
            });
            // 2. Get agent's reply from DeepSeek
            const reply = yield (0, deepseek_services_1.getAgentResponseFromDeepSeek)({ conversationId });
            console.log("let's save the reply in the db ");
            // 3. Save agent message to DB
            const agentMessage = yield prisma_utils_1.default.message.create({
                data: {
                    conversationId,
                    isFromAgent: true,
                    message: reply,
                },
            });
            console.log("and send it back ");
            // 4. Return both messages to client
            res.status(200).json({
                success: true,
                userMessage,
                agentMessage,
            });
        }
        catch (error) {
            console.error("sendMessageController error:", error);
            res.status(500).json({ error: "Failed to send and process message." });
        }
    }
});
exports.sendMessageController = sendMessageController;
const getConversationHistoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const history = yield ConversationServices.getConversationHistory(id);
        res.status(200).json({
            success: true,
            message: "Conversation history retrieved successfully",
            length: history.length,
            data: history,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to retrieve conversation history",
            data: null,
            error: error.message,
        });
    }
});
exports.getConversationHistoryController = getConversationHistoryController;
