


import { Request, Response } from "express";
import * as AgentServices from "../services/agent.services";
import CustomUser from "../types/user";

interface Agent {
    userId: string;
    name: string;
    description: string;
    settings: { [key: string]: any };
}

// Create Agent
export const createAgent = async (req: Request, res: Response) => {
    try {
        const user = req.user as CustomUser;
        const { name, description, settings } = req.body as Agent;
        const agent = await AgentServices.createAgent({
            userId: user.id,
            name,
            description,
            settings : settings || {},
        });
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


export const getAllAgents = async (req: Request, res: Response) => {
    try {
        console.log(req.user);
        
        const user = req.user as CustomUser;
        if (!req.user) {
             res.status(401).json({
                success: false,
                message: "Unauthorized: User information is missing",
                data: null,
                error: "User not authenticated",
            });
    } else {

        console.log(user.id)
        const agents = await AgentServices.getAllAgents(user.id);
         res.status(200).json({
            success: true,
            message: "Agents retrieved successfully",
            count: agents.length,
            data: agents,
            error: null,
        });
    }

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

// Build Agent 
export const buildAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    const buildData = req.body;

    const updatedAgent = await AgentServices.buildAgent(agentId, buildData);

    res.status(200).json({
      success: true,
      message: 'Agent built successfully',
      data: updatedAgent,
      error: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Building agent failed',
      data: null,
      error: error.message,
    });
  }
};
