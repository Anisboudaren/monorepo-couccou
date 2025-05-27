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
exports.deleteMessage = exports.updateMessage = exports.getAllMessages = exports.getMessageById = exports.createMessage = void 0;
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
const createMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield prisma_utils_1.default.message.create({
        data,
    });
    return message;
});
exports.createMessage = createMessage;
const getMessageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield prisma_utils_1.default.message.findUnique({
        where: { id },
    });
    if (!message) {
        throw new Error("Message not found");
    }
    return message;
});
exports.getMessageById = getMessageById;
const getAllMessages = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_utils_1.default.message.findMany();
});
exports.getAllMessages = getAllMessages;
const updateMessage = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield prisma_utils_1.default.message.update({
        where: { id },
        data,
    });
    return message;
});
exports.updateMessage = updateMessage;
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_utils_1.default.message.delete({
        where: { id },
    });
    return true;
});
exports.deleteMessage = deleteMessage;
