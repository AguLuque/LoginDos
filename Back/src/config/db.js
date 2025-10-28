import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,

});

// Función para probar la conexión
export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(` Conectado a MySQL - Base de datos: ${process.env.DB_NAME}`);
        connection.release();
        return true;
    } catch (error) {
        console.error(" Error conectando a la base de datos:", error.message);
        return false;
    }
};

export default pool;