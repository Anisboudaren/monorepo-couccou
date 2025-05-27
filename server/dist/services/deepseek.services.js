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
exports.getAgentResponseFromDeepSeek = void 0;
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
    console.log("settigngs :", settings);
    // 3. Build a dynamic system prompt
    const systemPromptParts = [
        `You are ${settings.aiName || "an assistant"} for a company.`,
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
