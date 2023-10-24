import dotenv from "dotenv";
// Carga las variables de entorno desde .env
dotenv.config();
// Configura la conexión a la base de datos PostgreSQL usando variables de entorno
const pool = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"), // Utiliza 5432 si no se especifica en .env
};
module.exports = pool;
