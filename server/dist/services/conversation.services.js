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
exports.getConversationHistory = exports.addMessageToConversation = exports.initiateAnonymousConversation = exports.deleteConversation = exports.updateConversation = exports.getConversationsByAgent = exports.getAllConversations = exports.getConversationById = exports.createConversation = void 0;
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
const createConversation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield prisma_utils_1.default.conversation.create({
        data,
    });
    return conversation;
});
exports.createConversation = createConversation;
const getConversationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield prisma_utils_1.default.conversation.findUnique({
        where: { id },
        include: {
            messages: true, // Include messages in the conversation
        },
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    return conversation;
});
exports.getConversationById = getConversationById;
const getAllConversations = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("service get all conversations");
    return yield prisma_utils_1.default.conversation.findMany();
});
exports.getAllConversations = getAllConversations;
const getConversationsByAgent = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_utils_1.default.conversation.findMany({
        where: { agentId: agentId },
        include: {
            messages: true, // Include user details
            agent: true, // Include agent details
        },
    });
});
exports.getConversationsByAgent = getConversationsByAgent;
const updateConversation = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield prisma_utils_1.default.conversation.update({
        where: { id },
        data,
    });
    return conversation;
});
exports.updateConversation = updateConversation;
const deleteConversation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_utils_1.default.conversation.delete({
        where: { id },
    });
    return true;
});
exports.deleteConversation = deleteConversation;
// This function initiates a conversation with an agent and creates the first message
const initiateAnonymousConversation = (_a) => __awaiter(void 0, [_a], void 0, function* ({ agentId, firstMessage, }) {
    const conversation = yield prisma_utils_1.default.conversation.create({
        data: {
            agentId,
            messages: {
                create: {
                    isFromAgent: false,
                    message: firstMessage,
                },
            },
        },
        include: {
            messages: true,
        },
    });
    return conversation;
});
exports.initiateAnonymousConversation = initiateAnonymousConversation;
const addMessageToConversation = (_a) => __awaiter(void 0, [_a], void 0, function* ({ conversationId, isFromAgent, message, }) {
    // Check if the conversation exists
    const conversation = yield prisma_utils_1.default.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: true }, // Include messages in case we want to do something with them
    });
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    // Create a new message and associate it with the conversation
    const newMessage = yield prisma_utils_1.default.message.create({
        data: {
            conversationId,
            isFromAgent,
            message,
        },
    });
    // Return the updated conversation with the new message included
    return {
        conversation,
        newMessage,
    };
});
exports.addMessageToConversation = addMessageToConversation;
const getConversationHistory = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma_utils_1.default.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
    });
    return messages;
});
exports.getConversationHistory = getConversationHistory;
