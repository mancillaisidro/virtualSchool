"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = exports.validateAssignmenttoUpdate = exports.validateAssignment = void 0;
const joi_1 = __importDefault(require("joi"));
/* interface Assignment{
    assignmentId: number,
    title: string,
    lessonId: number,
    description: string,
    dueDate: string,
    userId: number,
}*/
const customMessages = {
    'number.integer': "id must be an integer number",
};
const validateAssignment = (req, res, next) => {
    const assignmentSchema = joi_1.default.object({
        lessonId: joi_1.default.number().min(1).required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        dueDate: joi_1.default.date().required(),
        userId: joi_1.default.number().min(1).required(),
        pathToDB: joi_1.default.string().required(),
    });
    const { error } = assignmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateAssignment = validateAssignment;
const validateAssignmenttoUpdate = (req, res, next) => {
    const assignmentUpdateSchema = joi_1.default.object({
        userId: joi_1.default.number().min(0).max(100).required(),
        lessonId: joi_1.default.number().min(1).required(),
        assignmentId: joi_1.default.number().min(1).required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        dueDate: joi_1.default.date().required(),
    });
    const { error } = assignmentUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateAssignmenttoUpdate = validateAssignmenttoUpdate;
const validateId = (req, res, next) => {
    const assignmentSchema = joi_1.default.object({
        id: joi_1.default.number().integer().min(1).required().messages(customMessages),
    });
    const { error } = assignmentSchema.validate(req.params, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateId = validateId;
module.exports = { validateAssignment: exports.validateAssignment, validateAssignmenttoUpdate: exports.validateAssignmenttoUpdate, validateId: exports.validateId };
