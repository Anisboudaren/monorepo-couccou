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
const AgentController = __importStar(require("../controllers/agent.controllers"));
const router = (0, express_1.Router)();
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
router.post("/:id/build", AgentController.buildAgent);
exports.default = router;
