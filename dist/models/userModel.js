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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.isUserAuthTo = exports.userIdExist = exports.emailExist = void 0;
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const userPermissions = [
    ["createExamSubmition", "createAssignmentSubmition"],
    ["createCourse", "createLesson", "createExam", "createAssignment", "gradeExam", "gradeAssignment"],
    ["createExamSubmition", "createAssignmentSubmition", "createCourse", "createLesson", "createExam", "createAssignment", "gradeExam", "gradeAssignment"]
];
const emailExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT id FROM public.user WHERE mail = $1';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [req.body.email]);
        result.rows.length === 0 ? next() : res.json({ result: 'Email already registered, sign in or create a new user.', status: 1 });
    }
    catch (error) {
        console.error("Errror trying to get a row in emailExistFucntion:", error);
        return { error: "Errror trying to get a row:", status: 0 };
    }
});
exports.emailExist = emailExist;
const userIdExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT id FROM public.user WHERE id = $1';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [req.body.email]);
        result.rows.length === 0 ? next() : res.json({ result: 'User Id does not exist.', status: 1 });
    }
    catch (error) {
        console.error("Errror trying to get a row:", error);
        return { error: "Errror trying to get a row:", status: 0 };
    }
});
exports.userIdExist = userIdExist;
const isUserAuthTo = (action, userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    try {
        const query = 'SELECT user_type FROM public.user WHERE id = $1';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [userId]);
        if (result.rows.length === 0) {
            return { isAllowed: false };
        }
        else {
            const usrType = result.rows[0].user_type;
            return { isAllowed: userPermissions[usrType].includes(action) };
        }
    }
    catch (error) {
        console.error("Errror trying to get a row in isUserAuthFunction:", error);
        return { error: "Errror trying to get a row:", status: 0 };
    }
});
exports.isUserAuthTo = isUserAuthTo;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT id, name, mail FROM public.user;';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query);
        if (result.rows.length === 0) {
            return { result: "There are no users registered", status: 1 };
        }
        else {
            return { result: result.rows, status: 1 };
        }
    }
    catch (error) {
        console.error("Errror trying to get a row:", error);
        return { error: "Errror trying to get a row:", status: 0 };
    }
});
exports.getAllUsers = getAllUsers;
module.exports = { emailExist: exports.emailExist, isUserAuthTo: exports.isUserAuthTo, getAllUsers: exports.getAllUsers };
