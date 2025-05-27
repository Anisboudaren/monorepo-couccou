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
exports.buildAgent = exports.deleteAgent = exports.updateAgent = exports.getAllAgents = exports.getAgentById = exports.createAgent = void 0;
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
const createAgent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield prisma_utils_1.default.agent.create({
        data,
    });
    return agent;
});
exports.createAgent = createAgent;
const getAgentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield prisma_utils_1.default.agent.findUnique({
        where: { id },
    });
    if (!agent) {
        throw new Error("Agent not found");
    }
    return agent;
});
exports.getAgentById = getAgentById;
const getAllAgents = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_utils_1.default.agent.findMany({
        where: { userId },
    });
});
exports.getAllAgents = getAllAgents;
const updateAgent = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield prisma_utils_1.default.agent.update({
        where: { id },
        data,
    });
    return agent;
});
exports.updateAgent = updateAgent;
const deleteAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_utils_1.default.agent.delete({
        where: { id },
    });
    return true;
});
exports.deleteAgent = deleteAgent;
const buildAgent = (id, buildData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const generatedPrompt = (_a = buildData.customPrompt) !== null && _a !== void 0 ? _a : generatePrompt(buildData);
    console.log(generatePrompt);
    const updatedAgent = yield prisma_utils_1.default.agent.update({
        where: { id },
        data: {
            settings: Object.assign(Object.assign({}, buildData), { prompt: generatedPrompt }),
        },
    });
    if (!updatedAgent) {
        throw new Error('Agent not found');
    }
    return updatedAgent;
});
exports.buildAgent = buildAgent;
function generatePrompt(data) {
    var _a;
    return `You are ${data.aiName}, a ${(_a = data.primaryTraits) === null || _a === void 0 ? void 0 : _a.join(', ')} assistant. Your tone is ${data.communicationTone}, and you respond with a formality level of ${data.formalityLevel}. Your primary function is ${data.primaryFunction}. Company info: ${data.companyInformation}. Rules: ${data.rules}.`;
}
