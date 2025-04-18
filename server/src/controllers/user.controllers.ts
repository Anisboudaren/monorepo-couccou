import { Request, Response } from "express";
import * as UserServices from "../services/user.services";

// Create User
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await UserServices.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "User creation failed",
            data: null,
            error: error.message,
        });
    }
};

// Get User by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await UserServices.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
            error: null,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "User not found",
            data: null,
            error: error.message,
        });
    }
};

// Get All Users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await UserServices.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            count : users.length,
            data: users,
            error: null,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            data: null,
            error: "Failed to fetch users",
        });
    }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await UserServices.updateUser(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "User update failed",
            data: null,
            error: error.message,
        });
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
    try {
        await UserServices.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "User deletion failed",
            data: null,
            error: error.message,
        });
    }
};

// Get User Agents
export const getUserAgents = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const agents = await UserServices.getUserAgents(userId);
        res.status(200).json({
            success: true,
            message: "Agents retrieved successfully for user",
            count : agents.length,
            data: agents,
            error: null,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Could not retrieve agents for user",
            data: null,
            error: error.message,
        });
    }
};