import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",         // 👈 "mysql" es el nombre del servicio en docker-compose
  user: process.env.DB_USER || "loginuser",     // 👈 definidos en tu .env general
  password: process.env.DB_PASSWORD || "loginpass",
  database: process.env.DB_NAME || "login_db",
  port: process.env.DB_PORT || 3306,            // 👈 puerto interno del contenedor
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,
});

// Test de conexión
export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Conectado a MySQL - Base de datos: ${process.env.DB_NAME}`);
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error.message);
    return false;
  }
};

export default pool;
