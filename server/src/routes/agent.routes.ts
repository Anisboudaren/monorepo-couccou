import { Router } from "express";
import * as AgentController from "../controllers/agent.controllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Agent
 *   description: Agent management
 */

/**
 * @swagger
 * /agent/add:
 *   post:
 *     summary: Create a new agent
 *     tags: [Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User's ID
 *               name:
 *                 type: string
 *                 description: Agent's name
 *               description:
 *                 type: string
 *                 description: Agent's description
 *               settings:
 *                 type: object
 *                 description: Agent's settings
 *     responses:
 *       201:
 *         description: Agent created successfully
 */
router.post("/add", AgentController.createAgent);

/**
 * @swagger
 * /agent/{id}:
 *   get:
 *     summary: Get an agent by ID
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent retrieved successfully
 */
router.get("/:id", AgentController.getAgentById);

/**
 * @swagger
 * /agent:
 *   get:
 *     summary: Get all agents
 *     tags: [Agent]
 *     responses:
 *       200:
 *         description: Agents retrieved successfully
 */
router.get("/", AgentController.getAllAgents);

/**
 * @swagger
 * /agent/{id}:
 *   put:
 *     summary: Update an agent by ID
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Agent's name
 *               description:
 *                 type: string
 *                 description: Agent's description
 *               settings:
 *                 type: object
 *                 description: Agent's settings
 *     responses:
 *       200:
 *         description: Agent updated successfully
 */
router.put("/:id", AgentController.updateAgent);

/**
 * @swagger
 * /agent/{id}:
 *   delete:
 *     summary: Delete an agent by ID
 *     tags: [Agent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 */
router.delete("/:id", AgentController.deleteAgent);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

// Existing routes...


export default router;
