import { Router } from "express";
import * as MessageController from "../controllers/message.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message management
 */

/**
 * @swagger
 * /message/add:
 *   post:
 *     summary: Create a new message
 *     tags: [Message]
 */
router.post("/add", MessageController.createMessage);

/**
 * @swagger
 * /message/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Message]
 */
router.get("/:id", MessageController.getMessageById);

/**
 * @swagger
 * /message:
 *   get:
 *     summary: Get all messages
 *     tags: [Message]
 */
router.get("/", MessageController.getAllMessages);

/**
 * @swagger
 * /message/{id}:
 *   put:
 *     summary: Update a message by ID
 *     tags: [Message]
 */
router.put("/:id", MessageController.updateMessage);

/**
 * @swagger
 * /message/{id}:
 *   delete:
 *     summary: Delete a message by ID
 *     tags: [Message]
 */
router.delete("/:id", MessageController.deleteMessage);

export default router;
