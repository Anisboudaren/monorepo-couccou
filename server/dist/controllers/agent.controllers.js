"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAgent = exports.deleteAgent = exports.updateAgent = exports.getAllAgents = exports.getAgentById = exports.createAgent = void 0;
const AgentServices = __importStar(require("../services/agent.services"));
// Create Agent
const createAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { name, description, settings } = req.body;
        const agent = yield AgentServices.createAgent({
            userId: user.id,
            name,
            description,
            settings: settings || {},
        });
        res.status(201).json({
            success: true,
            message: "Agent created successfully",
            data: agent,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Agent creation failed",
            data: null,
            error: error.message,
        });
    }
});
exports.createAgent = createAgent;
// Get Agent by ID
const getAgentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield AgentServices.getAgentById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Agent retrieved successfully",
            data: agent,
            error: null,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Agent not found",
            data: null,
            error: error.message,
        });
    }
});
exports.getAgentById = getAgentById;
const getAllAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        const user = req.user;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: User information is missing",
                data: null,
                error: "User not authenticated",
            });
        }
        else {
            console.log(user.id);
            const agents = yield AgentServices.getAllAgents(user.id);
            res.status(200).json({
                success: true,
                message: "Agents retrieved successfully",
                count: agents.length,
                data: agents,
                error: null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch agents",
            data: null,
            error: "Failed to fetch agents",
        });
    }
});
exports.getAllAgents = getAllAgents;
// Update Agent
const updateAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedAgent = yield AgentServices.updateAgent(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Agent updated successfully",
            data: updatedAgent,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Agent update failed",
            data: null,
            error: error.message,
        });
    }
});
exports.updateAgent = updateAgent;
// Delete Agent
const deleteAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield AgentServices.deleteAgent(req.params.id);
        res.status(200).json({
            success: true,
            message: "Agent deleted successfully",
            data: null,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Agent deletion failed",
            data: null,
            error: error.message,
        });
    }
});
exports.deleteAgent = deleteAgent;
// Build Agent 
const buildAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req.params.id;
        const buildData = req.body;
        const updatedAgent = yield AgentServices.buildAgent(agentId, buildData);
        res.status(200).json({
            success: true,
            message: 'Agent built successfully',
            data: updatedAgent,
            error: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Building agent failed',
            data: null,
            error: error.message,
        });
    }
});
exports.buildAgent = buildAgent;
