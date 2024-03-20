"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = exports.validateExamtoUpdate = exports.validateExam = void 0;
const joi_1 = __importDefault(require("joi"));
/* interface Exam{
    examId: number,
    title: string,
    lessonId: number,
    description: string,
    dueDate: string,
    userId: number,
}*/
const validateExam = (req, res, next) => {
    const examSchema = joi_1.default.object({
        lessonId: joi_1.default.number().min(1).required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        dueDate: joi_1.default.date().required(),
        userId: joi_1.default.number().min(1).required(),
        pathToDB: joi_1.default.string().required(),
    });
    const { error } = examSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateExam = validateExam;
const validateExamtoUpdate = (req, res, next) => {
    const examUpdateSchema = joi_1.default.object({
        userId: joi_1.default.number().min(0).max(100).required(),
        lessonId: joi_1.default.number().min(1).required(),
        examId: joi_1.default.number().min(1).required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        dueDate: joi_1.default.date().required(),
    });
    const { error } = examUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateExamtoUpdate = validateExamtoUpdate;
const validateId = (req, res, next) => {
    const examSchema = joi_1.default.object({
        id: joi_1.default.number().min(1).required(),
    });
    const { error } = examSchema.validate(req.params, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateId = validateId;
module.exports = { validateExam: exports.validateExam, validateExamtoUpdate: exports.validateExamtoUpdate, validateId: exports.validateId };
