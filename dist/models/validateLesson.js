"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = exports.validateLessonUpdate = exports.validateLesson = void 0;
const joi_1 = __importDefault(require("joi"));
const customMessages = {
    'number.integer': "id must be an integer number",
    "numbeer.min": "id must be equal or greater than 100"
};
const validateLesson = (req, res, next) => {
    const assignmentSchema = joi_1.default.object({
        courseId: joi_1.default.number().min(100).integer().required(),
        title: joi_1.default.string().required(),
        userId: joi_1.default.number().integer().min(1).required(),
        link: joi_1.default.string()
    });
    const { error } = assignmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateLesson = validateLesson;
const validateLessonUpdate = (req, res, next) => {
    const assignmentSchema = joi_1.default.object({
        lessonId: joi_1.default.number().min(1000).integer().required(),
        title: joi_1.default.string().required(),
        link: joi_1.default.string()
    });
    const { error } = assignmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateLessonUpdate = validateLessonUpdate;
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
module.exports = { validateLesson: exports.validateLesson, validateId: exports.validateId, validateLessonUpdate: exports.validateLessonUpdate };
