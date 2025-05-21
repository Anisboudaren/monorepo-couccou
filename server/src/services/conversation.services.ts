import prisma from "../utils/prisma.utils";
import axios from "axios";

interface CreateConversationInput {
  userId: string;
  agentId: string;
}

export const createConversation = async (data: CreateConversationInput) => {
  const conversation = await prisma.conversation.create({
    data,
  });
  return conversation;
};

export const getConversationById = async (id: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: true, // Include messages in the conversation
    },
  });
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  return conversation;
};

export const getAllConversations = async () => {
  console.log("service get all conversations");
  
  return await prisma.conversation.findMany();
};



export const getConversationsByAgent = async (agentId: string) => {
  return await prisma.conversation.findMany({
    where: { agentId: agentId },
    include: {
      messages: true,   // Include user details
      agent: true,  // Include agent details
    },
  });
};

export const updateConversation = async (id: string, data: { userId?: string; agentId?: string }) => {
  const conversation = await prisma.conversation.update({
    where: { id },
    data,
  });
  return conversation;
};

export const deleteConversation = async (id: string) => {
  await prisma.conversation.delete({
    where: { id },
  });
  return true;
};

interface InitiateConversationInput {
  agentId: string;
  firstMessage: string;
}

// This function initiates a conversation with an agent and creates the first message
export const initiateAnonymousConversation = async ({
  agentId,
  firstMessage,
}: InitiateConversationInput) => {
  const conversation = await prisma.conversation.create({
    data: {
      agentId,
      messages: {
        create: {
          isFromAgent: false,
          message: firstMessage,
        },
      },
    },
    include: {
      messages: true,
    },
  });

  return conversation;
};

// This function adds a message to an existing conversation
interface AddMessageToConversationInput {
  conversationId: string;
  isFromAgent: boolean;
  message: string;
}

export const addMessageToConversation = async ({
  conversationId,
  isFromAgent,
  message,
}: AddMessageToConversationInput) => {
  // Check if the conversation exists
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { messages: true }, // Include messages in case we want to do something with them
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Create a new message and associate it with the conversation
  const newMessage = await prisma.message.create({
    data: {
      conversationId,
      isFromAgent,
      message,
    },
  });

  // Return the updated conversation with the new message included
  return {
    conversation,
    newMessage,
  };
};

