"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Carga las variables de entorno desde .env
dotenv_1.default.config();
// Configura la conexión a la base de datos PostgreSQL usando variables de entorno
const pool = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: {
        sslmode: 'require', // Establece sslmode en 'require'
    }
};
module.exports = pool;
