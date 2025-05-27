import prisma from "../utils/prisma.utils";
import axios from "axios";

interface GetAgentResponseInput {
  conversationId: string;
}

export const getAgentResponseFromDeepSeek = async ({
  conversationId,
}: GetAgentResponseInput) => {
  // 1. Fetch last 10 messages
  console.log("i am inside the deep seek respoonse");
  
  const messages = (await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 10,
  })).reverse()
 console.log("finished getting the last 10 messgaes ")
  // 2. Fetch the agent and its settings
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { agent: true },
  });
console.log("now i got the agent info from the conversion id ")
  if (!conversation || !conversation.agent) {
    throw new Error("Agent not found for this conversation");
  }
console.log(" setting up the agent settings as json")
  const settings = conversation.agent.settings as any; // assume settings is a JSON object
console.log("settigngs :" , settings)
  // 3. Build a dynamic system prompt
 const systemPromptParts = [
  `You are ${settings.aiName || "an assistant"} for a company.`,
  `Respond with a ${settings.communicationTone || "professional"} tone.`,
  `Use formality level ${settings.formalityLevel ?? 2} (1=casual, 2=neutral, 3=formal).`,
  settings.primaryTraits?.length
    ? `Your personality traits are: ${settings.primaryTraits.join(", ")}.`
    : null,
  settings.primaryFunction
    ? `Your main function is to: ${settings.primaryFunction}.`
    : null,
  settings.brandValues
    ? `Reflect these brand values: ${settings.brandValues}.`
    : null,
  settings.rules
    ? `You must follow these rules: ${settings.rules}.`
    : null,
  settings.companyInformation
    ? `Company information: ${settings.companyInformation}.`
    : null,

  // 🧠 Core behavioral constraints
  `Only answer the user's specific question.`,
  `Do NOT include any contact information, website links, or promotional content unless explicitly asked.`,
  `Avoid greetings, closings, and filler phrases.`,
  `Do NOT repeat the question. Just answer it concisely.`,
  `Keep responses brief — 1 to 2 sentences max.`,
  `Do NOT say you're an AI.`,
  `Always be respectful and helpful.`,
].filter(Boolean); // removes null entries



  

  const systemPrompt = systemPromptParts.join(" ");
console.log("the final prompt : " , systemPrompt)
  // 4. Format messages
  const formattedMessages = messages.map((msg) => ({
    role: msg.isFromAgent ? "assistant" : "user",
    content: msg.message,
  }));

  const deepseekMessages = [
    { role: "system", content: systemPrompt },
    ...formattedMessages,
  ];

  console.log(settings.model)
  // 5. Call DeepSeek API
let response;
try {
  response = await axios.post(
    "https://api.deepseek.com/v1/chat/completions",
    {
      model: "deepseek-chat",
      messages: deepseekMessages,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
} catch (error: any) {
  console.error("DeepSeek API Error:", error?.response?.data || error.message);
  throw new Error("Failed to get response from DeepSeek API");
}

  // 6. Return the reply
  const reply = response.data?.choices?.[0]?.message?.content;
  console.log("and here is the deep seek response " , reply)

  if (!reply) {
    throw new Error("No response from DeepSeek");
  }

  return reply;
};
