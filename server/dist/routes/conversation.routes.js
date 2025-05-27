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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ConversationController = __importStar(require("../controllers/conversation.controllers"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Conversation management
 */
/**
 * @swagger
 * /conversation/add:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversation]
 */
router.post("/add", ConversationController.createConversation);
/**
 * @swagger
 * /conversation/{id}:
 *   get:
 *     summary: Get a conversation by ID
 *     tags: [Conversation]
 */
router.get("/:id", ConversationController.getConversationById);
/**
 * @swagger
 * /conversation:
 *   get:
 *     summary: Get all conversations
 *     tags: [Conversation]
 */
router.get("/", ConversationController.getAllConversations);
/**
 * @swagger
 * /conversation/agent/{agentId}:
 *   get:
 *     summary: Get conversations by agent ID
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 */
router.get("/agent/:agentId", ConversationController.getConversationsByAgent);
/**
 * @swagger
 * /conversation/{id}:
 *   put:
 *     summary: Update a conversation by ID
 *     tags: [Conversation]
 */
router.put("/:id/history", ConversationController.updateConversation);
/**
 * @swagger
 * /conversation/{id}:
 *   delete:
 *     summary: Delete a conversation by ID
 *     tags: [Conversation]
 */
router.delete("/:id", ConversationController.deleteConversation);
/**
 * @swagger
 * /conversation/initiate:
 *   post:
 *     summary: Initiate a conversation
 *     tags: [Conversation]
 */
router.post("/init", ConversationController.initiateConversationController);
/**
 * @swagger
 * /conversation/addMessage:
 *   post:
 *     summary: Send a message to an existing conversation
 *     tags: [Conversation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationID:
 *                 type: string
 *                 description: The ID of the conversation
 *               message:
 *                 type: string
 *                 description: The message content
 *               isFromAgent:
 *                 type: boolean
 *                 description: Indicates if the message is from an agent
 *             required:
 *               - conversationID
 *               - message
 *               - isFromAgent
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Conversation not found
 */
router.post("/addMessage", ConversationController.addMessageToConversationController);
router.post("/getAgentResponse", ConversationController.handleAgentReply);
/**
 * @swagger
 * /conversation/{id}/send:
 *   post:
 *     summary: Send a message to the agent and receive the agent's response (used by the chat frontend)
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message content to send to the agent
 *             required:
 *               - message
 *     responses:
 *       200:
 *         description: Agent response to the sent message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agentResponse:
 *                   type: string
 *                   description: The agent's reply message
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Conversation not found
 */
router.post("/send", ConversationController.sendMessageController);
router.get("/:id/history", ConversationController.getConversationHistoryController);
exports.default = router;
