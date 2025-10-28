import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../service/authS.js';

// Controlador para LOGIN (solo verifica credenciales)
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación básica
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email y contraseña son requeridos"
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Formato de email inválido"
            });
        }

        // Buscar usuario en la base de datos
        const usuario = await getUserByEmail(email);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado. Por favor regístrate primero."
            });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        
        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                message: "Contraseña incorrecta"
            });
        }

        // Generar token
        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email 
            },
            process.env.JWT_SECRET || 'tu_clave_secreta',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre
            }
        });

    } catch (error) {
        console.error("Error en loginController:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Controlador para REGISTRO (crea nuevos usuarios)
export const registerController = async (req, res) => {
    try {
        const { email, password, nombre } = req.body;

        // Validaciones
        if (!email || !password || !nombre) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

    // Verificar si el usuario ya existe
        const usuarioExistente = await getUserByEmail(email);
        
        if (usuarioExistente) {
            return res.status(409).json({
                success: false,
                message: "El email ya está registrado. Por favor inicia sesión."
            });
        }

        // Crear nuevo usuario
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario = await createUser({
            email,
            password: hashedPassword,
            nombre
        });

        // Generar token
        const token = jwt.sign(
            { 
                id: nuevoUsuario.id, 
                email: nuevoUsuario.email 
            },
            process.env.JWT_SECRET || 'tu_clave_secreta',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            token,
            user: {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre
            }
        });

    } catch (error) {
        console.error("Error en registerController:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: "El email ya está registrado"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Controlador para verificar token
export const verifyTokenController = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        const usuario = await getUserByEmail(decoded.email);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        res.json({
            success: true,
            user: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre
            }
        });

    } catch (error) {
        console.error("Error al verificar token:", error);
        res.status(401).json({
            success: false,
            message: "Token inválido"
        });
    }
};