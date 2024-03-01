import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

// we define the object type User
interface User{
    email: string,
    password: string,
    userType: string
  }

export const createUser = async (email: string, name: string, userType: string, password: string) => {
  try {
    const query =
      'INSERT INTO public.user (mail, name, user_type, password) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [email, name, userType, password];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    return { result: result.rows[0], status: 1 };
  } catch (error) {
    console.error("Error trying to register a new user: ", error);
    return { error: "Error trying to register a new user", status: 0 };
  }
};

export const getUserById = async (id: number) => {
  try {
    const query = 'SELECT * FROM public.user WHERE id = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return { result: "User not exist", status: 1 };
    } else {
      return { result: result.rows[0], status: 1 };
    }
  } catch (error) {
    console.error("Errror trying to get a row:", error);
    return { error: "Errror trying to get a row:", status: 0 };
  }
};

export const getUserAuth = async (user: User) => {
  try {
    const query = 'SELECT * FROM public.user WHERE mail = $1 AND password = $2 AND user_type = $3';
    const pool = new Pool(config);
    const result = await pool.query(query, [user.email, user.password, user.userType]);
    if (result.rows.length === 0) {
      return { result: "User not exist", status: 1 };
    } else {
      return { result: result.rows[0], status: 1 };
    }
  } catch (error) {
    console.error("Errror trying to get a row:", error);
    return { error: "Errror trying to get a row:", status: 0 };
  }
};

module.exports = { createUser, getUserById, getUserAuth};
