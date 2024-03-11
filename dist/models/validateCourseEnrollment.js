"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStudentCourse = exports.validateStudentCourseUpdate = void 0;
const joi_1 = __importDefault(require("joi"));
const validateStudentCourseUpdate = (req, res, next) => {
    const newSchema = joi_1.default.object({
        userId: joi_1.default.number().min(1).required().integer(),
        courseId: joi_1.default.number().min(100).required().integer(),
        status: joi_1.default.number().min(0).required().integer()
    });
    const { error } = newSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateStudentCourseUpdate = validateStudentCourseUpdate;
const validateStudentCourse = (req, res, next) => {
    const newSchema = joi_1.default.object({
        userId: joi_1.default.number().min(1).required().integer(),
        courseId: joi_1.default.number().min(1).required().integer(),
    });
    const { error } = newSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateStudentCourse = validateStudentCourse;
module.exports = { validateStudentCourse: exports.validateStudentCourse, validateStudentCourseUpdate: exports.validateStudentCourseUpdate };
