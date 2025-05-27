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
const UserController = __importStar(require("../controllers/user.controllers"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */
/**
 * @swagger
 * /user/add:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               username:
 *                 type: string
 *                 description: User's username
 *               role:
 *                 type: string
 *                 description: User's role (e.g., 'user', 'admin')
 *               settings:
 *                 type: object
 *                 description: User's settings (e.g., theme)
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: object
 *                   description: The created user object
 *                 error:
 *                   type: string
 *                   description: Error message, if any
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: null
 *                   description: Null in case of error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.post("/add", UserController.createUser);
/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get the authenticated user's information
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 */
router.get("/me", UserController.getMe);
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: object
 *                   description: The user object
 *                 error:
 *                   type: string
 *                   description: Error message, if any
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: null
 *                   description: Null in case of error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get("/:id", UserController.getUserById);
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: The user object
 *                 error:
 *                   type: string
 *                   description: Error message, if any
 *       500:
 *         description: Failed to fetch users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: null
 *                   description: Null in case of error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get("/", UserController.getAllUsers);
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               username:
 *                 type: string
 *                 description: User's username
 *               role:
 *                 type: string
 *                 description: User's role (e.g., 'user', 'admin')
 *               settings:
 *                 type: object
 *                 description: User's settings (e.g., theme)
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: object
 *                   description: The updated user object
 *                 error:
 *                   type: string
 *                   description: Error message, if any
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: null
 *                   description: Null in case of error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.put("/:id", UserController.updateUser);
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: null
 *                   description: Null in case of successful deletion
 *                 error:
 *                   type: string
 *                   description: Error message, if any
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome
 *                 data:
 *                   type: null
 *                   description: Null in case of error
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.delete("/:id", UserController.deleteUser);
/**
 * @swagger
 * /user/{userId}/agents:
 *   get:
 *     summary: Get all agents for a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Agents retrieved successfully
 */
router.get("/:userId/agents", UserController.getUserAgents);
exports.default = router;
