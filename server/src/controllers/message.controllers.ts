import { Request, Response } from "express";
import * as MessageServices from "../services/message.services";
import { count } from "console";

// Create Message
export const createMessage = async (req: Request, res: Response) => {
    try {
        const message = await MessageServices.createMessage(req.body);
        res.status(201).json({
            success: true,
            message: "Message created successfully",
            data: message,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Message creation failed",
            data: null,
            error: error.message,
        });
    }
};

// Get Message by ID
export const getMessageById = async (req: Request, res: Response) => {
    try {
        const message = await MessageServices.getMessageById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Message retrieved successfully",
            data: message,
            error: null,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Message not found",
            data: null,
            error: error.message,
        });
    }
};

// Get All Messages
export const getAllMessages = async (_req: Request, res: Response) => {
    try {
        const messages = await MessageServices.getAllMessages();
        res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            count: messages.length,
            data: messages,
            error: null,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            data: null,
            error: "Failed to fetch messages",
        });
    }
};

// Update Message
export const updateMessage = async (req: Request, res: Response) => {
    try {
        const updatedMessage = await MessageServices.updateMessage(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: updatedMessage,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Message update failed",
            data: null,
            error: error.message,
        });
    }
};

// Delete Message
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        await MessageServices.deleteMessage(req.params.id);
        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            data: null,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Message deletion failed",
            data: null,
            error: error.message,
        });
    }
};
