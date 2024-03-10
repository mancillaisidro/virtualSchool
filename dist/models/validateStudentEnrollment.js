"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateStudentCourse = exports.validateStudentCourse = void 0;
const joi_1 = __importDefault(require("joi"));
const validateStudentCourse = (req, res, next) => {
    const newSchema = joi_1.default.object({
        userId: joi_1.default.number().min(1).required(),
        courseId: joi_1.default.number().min(1).required(),
        status: joi_1.default.number().min(0).required()
    });
    const { error } = newSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateStudentCourse = validateStudentCourse;
const validateUpdateStudentCourse = (req, res, next) => {
    const newSchema = joi_1.default.object({
        userId: joi_1.default.number().min(1).required(),
        courseId: joi_1.default.number().min(1).required()
    });
    const { error } = newSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateUpdateStudentCourse = validateUpdateStudentCourse;
module.exports = { validateStudentCourse: exports.validateStudentCourse, validateUpdateStudentCourse: exports.validateUpdateStudentCourse };
