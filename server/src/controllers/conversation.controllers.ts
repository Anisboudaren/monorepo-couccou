import { Request, Response } from "express";
import * as ConversationServices from "../services/conversation.services";
import { count } from "console";
import { initiateAnonymousConversation , addMessageToConversation } from "../services/conversation.services";
import { getAgentResponseFromDeepSeek } from "../services/deepseek.services";
import prisma from "../utils/prisma.utils";

// Create Conversation
export const createConversation = async (req: Request, res: Response) => {
  try {
    const conversation = await ConversationServices.createConversation(req.body);
    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: conversation,
      error: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Conversation creation failed",
      data: null,
      error: error.message,
    });
  }
};

// Get Conversation by ID
export const getConversationById = async (req: Request, res: Response) => {
  try {
    const conversation = await ConversationServices.getConversationById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Conversation retrieved successfully",
      data: conversation,
      error: null,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Conversation not found",
      data: null,
      error: error.message,
    });
  }
};

// Get All Conversations
export const getAllConversations = async (_req: Request, res: Response) => {
  try {
    const conversations = await ConversationServices.getAllConversations();
    res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully",
      count: conversations.length ,
      data: conversations,
      error: null,
    });
  } catch (error: any) {
    console.log(error);
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      data: null,
      error: "Failed to fetch conversations",
    });
  }
};

// Get Conversations by Agent
export const getConversationsByAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.agentId;
    const conversations = await ConversationServices.getConversationsByAgent(agentId);
    res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully for agent",
      count: conversations.length,
      data: conversations,
      error: null,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Could not retrieve conversations for agent",
      data: null,
      error: error.message,
    });
  }
};

// Update Conversation
export const updateConversation = async (req: Request, res: Response) => {
  try {
    const updatedConversation = await ConversationServices.updateConversation(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Conversation updated successfully",
      data: updatedConversation,
      error: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Conversation update failed",
      data: null,
      error: error.message,
    });
  }
};

// Delete Conversation
export const deleteConversation = async (req: Request, res: Response) => {
  try {
    await ConversationServices.deleteConversation(req.params.id);
    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
      data: null,
      error: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Conversation deletion failed",
      data: null,
      error: error.message,
    });
  }
};

// Initiate Anonymous Conversation
export const initiateConversationController = async (req: Request, res: Response) => {
  const { agentId, firstMessage } = req.body; // Assuming agentId and firstMessage are sent in the body

  if (!agentId || !firstMessage) {
     res.status(400).json({ error: "AgentId and firstMessage are required" });
  }

  try {
    const conversation = await initiateAnonymousConversation({ agentId, firstMessage });
     res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while initiating the conversation." });
  }
};

// Add Message to Conversation
export const addMessageToConversationController = async (req: Request, res: Response) => {
  const { conversationId, isFromAgent, message } = req.body; // Assuming you pass conversationId, isFromAgent, and message in the request body

  if (!conversationId || !message) {
     res.status(400).json({ error: "ConversationId and message are required" });
  }

  try {
    const { conversation, newMessage } = await addMessageToConversation({
      conversationId,
      isFromAgent,
      message,
    });
     res.status(200).json({ conversation, newMessage });
  } catch (error) {
    console.error(error);
     res.status(500).json({ error: "An error occurred while adding the message." });
  }
};

export const handleAgentReply = async (req: Request, res: Response) => {
  const { conversationId } = req.body;

  if (!conversationId) {
     res.status(400).json({ error: "conversationId is required" });
  } else {

     try {
    // 1. Get assistant response
    const reply = await getAgentResponseFromDeepSeek({ conversationId });

    // 2. Save reply as a message from agent
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        isFromAgent: true,
        message: reply,
      },
    });

     res.status(200).json({ reply: newMessage });
  } catch (error: any) {
    console.error("DeepSeek error:", error);
     res.status(500).json({ error: "Failed to get agent response" });
  }
  }

 
};