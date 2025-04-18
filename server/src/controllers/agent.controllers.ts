import { Request, Response } from "express";
import * as AgentServices from "../services/agent.services";

// Create Agent
export const createAgent = async (req: Request, res: Response) => {
    try {
        const agent = await AgentServices.createAgent(req.body);
        res.status(201).json({
            success: true,
            message: "Agent created successfully",
            data: agent,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Agent creation failed",
            data: null,
            error: error.message,
        });
    }
};

// Get Agent by ID
export const getAgentById = async (req: Request, res: Response) => {
    try {
        const agent = await AgentServices.getAgentById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Agent retrieved successfully",
            data: agent,
            error: null,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Agent not found",
            data: null,
            error: error.message,
        });
    }
};

// Get All Agents
export const getAllAgents = async (_req: Request, res: Response) => {
    try {
        const agents = await AgentServices.getAllAgents();
        res.status(200).json({
            success: true,
            message: "Agents retrieved successfully",
            count : agents.length,
            data: agents,
            error: null,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch agents",
            data: null,
            error: "Failed to fetch agents",
        });
    }
};

// Update Agent
export const updateAgent = async (req: Request, res: Response) => {
    try {
        const updatedAgent = await AgentServices.updateAgent(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Agent updated successfully",
            data: updatedAgent,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Agent update failed",
            data: null,
            error: error.message,
        });
    }
};

// Delete Agent
export const deleteAgent = async (req: Request, res: Response) => {
    try {
        await AgentServices.deleteAgent(req.params.id);
        res.status(200).json({
            success: true,
            message: "Agent deleted successfully",
            data: null,
            error: null,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Agent deletion failed",
            data: null,
            error: error.message,
        });
    }
};
