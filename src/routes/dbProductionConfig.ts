import dotenv from "dotenv";
// Carga las variables de entorno desde .env
dotenv.config();
// Configura la conexión a la base de datos PostgreSQL usando variables de entorno
const pool = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: {
    sslmode: 'require', // Establece sslmode en 'require'
  }
};
module.exports = pool;
