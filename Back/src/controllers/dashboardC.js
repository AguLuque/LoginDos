import {
    getStats,
    getUltimosJugadores,
    getPartidosRecientes,
    getPartidosGanadosPorJugador,
    getJugadorPorNombre
} from '../service/dashboardS.js';

// Controlador para obtener estadísticas
export const statsController = async (req, res) => {
    try {
        const stats = await getStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("Error en statsController:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener estadísticas",
            error: error.message
        });
    }
};

// Controlador para obtener jugadores
export const jugadoresController = async (req, res) => {
    try {
        const limit = req.query.limit || 30;
        const jugadores = await getUltimosJugadores(parseInt(limit));
        
        res.json({
            success: true,
            data: jugadores
        });
    } catch (error) {
        console.error("Error en jugadoresController:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener jugadores",
            error: error.message
        });
    }
};

// Controlador para obtener partidos recientes
export const partidosController = async (req, res) => {
    try {
        const limit = req.query.limit || 30;
        const partidos = await getPartidosRecientes(parseInt(limit));
        
        res.json({
            success: true,
            data: partidos
        });
    } catch (error) {
        console.error("Error en partidosController:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener partidos",
            error: error.message
        });
    }
};

// Controlador para consultar partidos ganados por un jugador
export const partidosGanadosController = async (req, res) => {
    try {
        const { nombre } = req.params;
        
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: "El nombre del jugador es requerido"
            });
        }
        
        const partidos = await getPartidosGanadosPorJugador(nombre);
        
        res.json({
            success: true,
            data: partidos
        });
    } catch (error) {
        console.error("Error en partidosGanadosController:", error);
        res.status(500).json({
            success: false,
            message: "Error al consultar partidos ganados",
            error: error.message
        });
    }
};

// Controlador para buscar jugador por nombre
export const buscarJugadorController = async (req, res) => {
    try {
        const { nombre } = req.params;
        
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: "El nombre del jugador es requerido"
            });
        }
        
        const jugador = await getJugadorPorNombre(nombre);
        
        res.json({
            success: true,
            data: jugador
        });
    } catch (error) {
        console.error("Error en buscarJugadorController:", error);
        res.status(500).json({
            success: false,
            message: "Error al buscar jugador",
            error: error.message
        });
    }
};