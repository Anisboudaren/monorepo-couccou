import prisma from "../utils/prisma.utils";
import axios from "axios";

interface GetAgentResponseInput {
  conversationId: string;
}

export const getAgentResponseFromDeepSeek = async ({
  conversationId,
}: GetAgentResponseInput) => {
  // 1. Fetch last 10 messages from the conversation
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  // 2. Format messages for DeepSeek (user/assistant)
  const formattedMessages = messages.map((msg) => ({
    role: msg.isFromAgent ? "assistant" : "user",
    content: msg.message,
  }));

  // 3. Add system instruction for roleplay
  const deepseekMessages = [
    {
      role: "system",
      content:
        "You are a helpful and polite online store assistant. Respond concisely (under 50 words), professionally, and stay in character. Do not mention you are an AI. Always be respectful and helpful.",
    },
    ...formattedMessages,
  ];

  // 4. Call DeepSeek API
  const response = await axios.post(
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

  // 5. Extract response
  const reply = response.data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("No response from DeepSeek");
  }

  return reply;
};