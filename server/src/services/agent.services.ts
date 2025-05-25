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

export const getAllAgents = async (userId: string) => {
    return await prisma.agent.findMany({
        where: { userId },
    });
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



export const buildAgent = async (id: string, buildData: any) => {
  const generatedPrompt = buildData.customPrompt ?? generatePrompt(buildData);
  console.log(generatePrompt);
    
  const updatedAgent = await prisma.agent.update({
    where: { id },
    data: {
      settings: {
        ...buildData,
        prompt: generatedPrompt,
      },
    },
  });

  if (!updatedAgent) {
    throw new Error('Agent not found');
  }

  return updatedAgent;
};

function generatePrompt(data: any): string {
  return `You are ${data.aiName}, a ${data.primaryTraits?.join(', ')} assistant. Your tone is ${data.communicationTone}, and you respond with a formality level of ${data.formalityLevel}. Your primary function is ${data.primaryFunction}. Company info: ${data.companyInformation}. Rules: ${data.rules}.`;
}


