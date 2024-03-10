"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = exports.validateCourse = void 0;
const joi_1 = __importDefault(require("joi"));
const customMessages = {
    'number.integer': "id must be an integer number",
    "numbeer.min": "id must be equal or greater than 100"
};
const validateCourse = (req, res, next) => {
    const assignmentSchema = joi_1.default.object({
        courseId: joi_1.default.number().min(100).integer(),
        title: joi_1.default.string().required(),
        userId: joi_1.default.number().integer().min(1).required()
    });
    const { error } = assignmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateCourse = validateCourse;
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
module.exports = { validateCourse: exports.validateCourse, validateId: exports.validateId };
