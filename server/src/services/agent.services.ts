import prisma from "../utils/prisma.utils";

interface CreateAgentInput {
    userId: string;
    name: string;
    description?: string;
    settings?: any;
}

interface UpdateAgentInput {
    name?: string;
    description?: string;
    settings?: any;
}

export const createAgent = async (data: CreateAgentInput) => {
    const agent = await prisma.agent.create({
        data,
    });
    return agent;
};

export const getAgentById = async (id: string) => {
    const agent = await prisma.agent.findUnique({
        where: { id },
    });
    if (!agent) {
        throw new Error("Agent not found");
    }
    return agent;
};

export const getAllAgents = async () => {
    return await prisma.agent.findMany();
};

export const updateAgent = async (id: string, data: UpdateAgentInput) => {
    const agent = await prisma.agent.update({
        where: { id },
        data,
    });
    return agent;
};

export const deleteAgent = async (id: string) => {
    await prisma.agent.delete({
        where: { id },
    });
    return true;
};
