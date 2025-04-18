import { Router } from "express";
import * as UserController from "../controllers/user.controllers";

const router = Router();

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
export default router;
