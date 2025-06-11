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
console.log("settings :" , settings)
  // 3. Build a dynamic system prompt
const systemPromptParts = [
  `You are ${settings.aiName || "an assistant"} for a company.`,
 `You MUST always respond in this language: "${conversation.agent.language || "Arabic"}", no matter what the user says — even for greetings like "hi", "hello", or "thanks". Do not use English or any other language unless the user explicitly requests a different one.`,

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

  // 👤 Optional human handoff logic
  settings.allowHumanAgent
    ? `If the user asks to speak with a real person, respond politely by asking for their name, email, and a short description of the issue. Then say: "Thank you. A human support agent will contact you soon. In the meantime, feel free to ask me anything else."`
    : `If the user asks to speak with a human, explain that you're here to help and continue assisting them professionally.`,
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


export interface StructuredSiteData {
  siteTitle: string;
  description: string;
  links: string[];
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // adjust if needed

export const formatScrapedLinks = async (
  title: string,
  description: string,
  links: string[]
): Promise<string> => {
  const prompt = buildPrompt(title, description, links);

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat', // Replace with your actual model name if different
        messages: [
          {
            role: 'system',
            content:
             `
You are a sitemap structure generator.

Given a list of internal links from a website, structure them into a clear navigation hierarchy using **only a Markdown tree format** like:


- Section
  - Subsection
    - URL or description

❌ Do not include any explanation, introduction, commentary, questions, or observations.

✅ Just return the markdown code block and nothing else.
` },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek format failed:', error);
    throw new Error('Failed to format links with DeepSeek');
  }
};

const buildPrompt = (
  title: string,
  description: string,
  links: string[]
): string => {
  let prompt = `Website Title: ${title}\nDescription: ${description}\n\nLinks:\n`;

  links.forEach(link => {
    prompt += `- ${link}\n`;
  });

  return prompt;
};

/**
 * Summarize and extract meaningful content from a website using DeepSeek.
 */
export const summarizeWebsiteContent = async (markdown: string): Promise<string> => {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `
You are an intelligent assistant designed to extract all relevant, client-facing content from a website. 

Your goal is not to summarize, but to deeply understand and restructure the page content so that a chatbot agent can effectively use it to answer customer questions about the website, business, or services.

 Focus on:
- Products or services offered
- Descriptions, pricing, features, benefits
- Company info (about, values, location, contact)
- FAQs, instructions, guarantees, policies
- Anything a client might ask the chatbot about

 Ignore:
- Navigation menus, footers, ads, UI controls
- Empty, repetitive, or decorative text

 Structure your response like this:

website Overview
A short, clear paragraph that explains what the business or website is about.

Key Information
Organized content with clear bullet points or sections
-
-
- 
( use headings, bullet points, and concise text depending on the content) 

This information will be used by an AI chatbot to assist users — so make it comprehensive, clean, and factual. Do not mention that the content came from a webpage or markdown.
and add any detailes or information that you think is relevant to the user or will be helpful for the chatbot to answer questions about the website.
`,
          },
          {
            role: 'user',
            content: markdown,
          },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('DeepSeek content summarization failed:', error?.response?.data || error.message);
    throw new Error('Failed to summarize website content with DeepSeek');
  }
};
