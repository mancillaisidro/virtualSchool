"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateId = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const validateUser = (req, res, next) => {
    const userSchema = joi_1.default.object({
        email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        name: joi_1.default.string().alphanum().min(3).max(25).required(),
        password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: joi_1.default.ref('password'),
        userType: joi_1.default.number().integer().min(0).required()
    });
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateUser = validateUser;
const validateId = (req, res, next) => {
    const idSchema = joi_1.default.object({
        id: joi_1.default.number().required().min(0).max(100).integer()
    });
    const { error } = idSchema.validate(req.params, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateId = validateId;
const validateLogin = (req, res, next) => {
    const userSchema = joi_1.default.object({
        email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: joi_1.default.ref('password'),
        userType: joi_1.default.number().min(0).integer().required()
    });
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};
exports.validateLogin = validateLogin;
module.exports = { validateUser: exports.validateUser, validateId: exports.validateId, validateLogin: exports.validateLogin };
