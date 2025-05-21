import prisma from "../utils/prisma.utils";

interface CreateMessageInput {
    conversationId: string;
    isFromAgent: boolean;
    message: string;
}

export const createMessage = async (data: CreateMessageInput) => {
    const message = await prisma.message.create({
        data,
    });
    return message;
};

export const getMessageById = async (id: string) => {
    const message = await prisma.message.findUnique({
        where: { id },
    });
    if (!message) {
        throw new Error("Message not found");
    }
    return message;
};

export const getAllMessages = async () => {
    return await prisma.message.findMany();
};

export const updateMessage = async (id: string, data: { isFromAgent?: boolean; message?: string }) => {
    const message = await prisma.message.update({
        where: { id },
        data,
    });
    return message;
};

export const deleteMessage = async (id: string) => {
    await prisma.message.delete({
        where: { id },
    });
    return true;
};
