import { Router } from "express";
import * as ConversationController from "../controllers/conversation.controllers";

const router = Router();

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
router.put("/:id", ConversationController.updateConversation);

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
router.post("/initiate", ConversationController.initiateConversationController);

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

export default router;
