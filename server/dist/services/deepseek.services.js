"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeWebsiteContent = exports.formatScrapedLinks = exports.getAgentResponseFromDeepSeek = void 0;
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
const axios_1 = __importDefault(require("axios"));
const getAgentResponseFromDeepSeek = (_a) => __awaiter(void 0, [_a], void 0, function* ({ conversationId, }) {
    var _b, _c, _d, _e, _f, _g, _h;
    // 1. Fetch last 10 messages
    console.log("i am inside the deep seek respoonse");
    const messages = (yield prisma_utils_1.default.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: 10,
    })).reverse();
    console.log("finished getting the last 10 messgaes ");
    // 2. Fetch the agent and its settings
    const conversation = yield prisma_utils_1.default.conversation.findUnique({
        where: { id: conversationId },
        include: { agent: true },
    });
    console.log("now i got the agent info from the conversion id ");
    if (!conversation || !conversation.agent) {
        throw new Error("Agent not found for this conversation");
    }
    console.log(" setting up the agent settings as json");
    const settings = conversation.agent.settings; // assume settings is a JSON object
    console.log("settings :", settings);
    // 3. Build a dynamic system prompt
    const systemPromptParts = [
        `You are ${settings.aiName || "an assistant"} for a company.`,
        `You MUST always respond in this language: "${conversation.agent.language || "Arabic"}", no matter what the user says — even for greetings like "hi", "hello", or "thanks". Do not use English or any other language unless the user explicitly requests a different one.`,
        `Respond with a ${settings.communicationTone || "professional"} tone.`,
        `Use formality level ${(_b = settings.formalityLevel) !== null && _b !== void 0 ? _b : 2} (1=casual, 2=neutral, 3=formal).`,
        ((_c = settings.primaryTraits) === null || _c === void 0 ? void 0 : _c.length)
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
    console.log("the final prompt : ", systemPrompt);
    // 4. Format messages
    const formattedMessages = messages.map((msg) => ({
        role: msg.isFromAgent ? "assistant" : "user",
        content: msg.message,
    }));
    const deepseekMessages = [
        { role: "system", content: systemPrompt },
        ...formattedMessages,
    ];
    console.log(settings.model);
    // 5. Call DeepSeek API
    let response;
    try {
        response = yield axios_1.default.post("https://api.deepseek.com/v1/chat/completions", {
            model: "deepseek-chat",
            messages: deepseekMessages,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.error("DeepSeek API Error:", ((_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
        throw new Error("Failed to get response from DeepSeek API");
    }
    // 6. Return the reply
    const reply = (_h = (_g = (_f = (_e = response.data) === null || _e === void 0 ? void 0 : _e.choices) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.content;
    console.log("and here is the deep seek response ", reply);
    if (!reply) {
        throw new Error("No response from DeepSeek");
    }
    return reply;
});
exports.getAgentResponseFromDeepSeek = getAgentResponseFromDeepSeek;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // adjust if needed
const formatScrapedLinks = (title, description, links) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = buildPrompt(title, description, links);
    try {
        const response = yield axios_1.default.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat', // Replace with your actual model name if different
            messages: [
                {
                    role: 'system',
                    content: `
You are a sitemap structure generator.

Given a list of internal links from a website, structure them into a clear navigation hierarchy using **only a Markdown tree format** like:


- Section
  - Subsection
    - URL or description

❌ Do not include any explanation, introduction, commentary, questions, or observations.

✅ Just return the markdown code block and nothing else.
`
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
        }, {
            headers: {
                Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.choices[0].message.content;
    }
    catch (error) {
        console.error('DeepSeek format failed:', error);
        throw new Error('Failed to format links with DeepSeek');
    }
});
exports.formatScrapedLinks = formatScrapedLinks;
const buildPrompt = (title, description, links) => {
    let prompt = `Website Title: ${title}\nDescription: ${description}\n\nLinks:\n`;
    links.forEach(link => {
        prompt += `- ${link}\n`;
    });
    return prompt;
};
/**
 * Summarize and extract meaningful content from a website using DeepSeek.
 */
const summarizeWebsiteContent = (markdown) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.post(DEEPSEEK_API_URL, {
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
        }, {
            headers: {
                Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.choices[0].message.content;
    }
    catch (error) {
        console.error('DeepSeek content summarization failed:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error('Failed to summarize website content with DeepSeek');
    }
});
exports.summarizeWebsiteContent = summarizeWebsiteContent;
