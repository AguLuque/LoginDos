import pool from '../config/db.js'; // Ajusta la ruta según tu configuración

export const getUserByEmail = async (email) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM usuario WHERE email = ?',
            [email]
        );
        
        return rows[0] || null;
    } catch (error) {
        console.error("Error al buscar usuario por email:", error);
        throw error;
    }
};

// Crear nuevo usuario
export const createUser = async (userData) => {
    try {
        const { email, password, nombre } = userData;
        
        const [result] = await pool.execute(
            'INSERT INTO usuario (email, password, nombre) VALUES (?, ?, ?)',
            [email, password, nombre]
        );

        // Retornar el usuario creado
        const [newUser] = await pool.execute(
            'SELECT id, email, nombre, created_at FROM usuario WHERE id = ?',
            [result.insertId]
        );

        return newUser[0];
    } catch (error) {
        console.error("Error al crear usuario:", error);
        throw error;
    }
};

// Obtener usuario por ID
export const getUserById = async (id) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email, nombre, created_at FROM usuario WHERE id = ?',
            [id]
        );
        
        return rows[0] || null;
    } catch (error) {
        console.error("Error al buscar usuario por ID:", error);
        throw error;
    }
};

// Actualizar información del usuario
export const updateUser = async (id, userData) => {
    try {
        const { nombre, email } = userData;
        
        const [result] = await pool.execute(
            'UPDATE usuario SET nombre = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [nombre, email, id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Usuario no encontrado');
        }

        return await getUserById(id);
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};