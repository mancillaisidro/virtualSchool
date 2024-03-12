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
exports.getUserAuth = exports.getUserById = exports.createUser = void 0;
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const createUser = (email, name, userType, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'INSERT INTO public.user (mail, name, user_type, password, last_login) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *';
        const values = [email, name, userType, password];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        return { result: result.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error trying to register a new user: ", error);
        return { error: "Error trying to register a new user", status: 0 };
    }
});
exports.createUser = createUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT id, mail, name, user_type, password, last_login FROM public.user WHERE id = $1';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "User not exist", status: 1 };
        }
        else {
            return { result: result.rows[0], status: 1 };
        }
    }
    catch (error) {
        console.error("Errror trying to get a row:", error);
        return { error: "Errror trying to get a row:", status: 0 };
    }
});
exports.getUserById = getUserById;
const getUserAuth = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT id, mail, name, user_type, last_login FROM public.user WHERE mail = $1 AND password = $2 AND user_type = $3';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [user.email, user.password, user.userType]);
        if (result.rows.length === 0) {
            return { result: "User not exist", status: 1 };
        }
        else {
            return { result: result.rows[0], status: 1 };
        }
    }
    catch (error) {
        console.error("Errror trying to get a row:", error);
        return { error: "Errror trying to get a row:", status: 0 };
    }
});
exports.getUserAuth = getUserAuth;
module.exports = { createUser: exports.createUser, getUserById: exports.getUserById, getUserAuth: exports.getUserAuth };
