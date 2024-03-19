"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAssignmentGrade = exports.validateId = exports.validateAssignmentSubmit = void 0;
const joi_1 = __importDefault(require("joi"));
const validateAssignmentSubmit = (req, res, next) => {
    const newSchema = joi_1.default.object({
        userId: joi_1.default.number().min(1).required().integer(),
        assignmentId: joi_1.default.number().min(1).required().integer(),
        fileName: joi_1.default.string().required(),
        comment: joi_1.default.string()
    });
    const { error } = newSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateAssignmentSubmit = validateAssignmentSubmit;
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
const validateAssignmentGrade = (req, res, next) => {
    const newSchema = joi_1.default.object({
        teacherId: joi_1.default.number().min(1).required().integer(),
        submitionId: joi_1.default.number().min(1).required().integer(),
        score: joi_1.default.number().min(1).required().integer().max(100),
    });
    const { error } = newSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateAssignmentGrade = validateAssignmentGrade;
module.exports = { validateAssignmentSubmit: exports.validateAssignmentSubmit, validateId: exports.validateId, validateAssignmentGrade: exports.validateAssignmentGrade };
