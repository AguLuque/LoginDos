import { getJugadoresPorNombre, getTodosLosJugadores, testService,   getJugadoresMongo, crearJugadorMongo,} from "../service/jugadoresS.js";

export const fetchJugadoresPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params; 
        
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: "El parámetro 'nombre' es requerido y no puede estar vacío" 
            });
        }

        const data = await getJugadoresPorNombre(nombre.trim());

        if (!data || data.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: `No se encontraron jugadores con el nombre: ${nombre}`,
                data: []
            });
        }

        res.json({
            success: true,
            message: `Búsqueda completada para: ${nombre}`,
            data: data,
            count: data.length
        });

    } catch (error) {
        console.error("Error en fetchJugadoresPorNombre:", error);
        res.status(500).json({ 
            success: false,
            message: "Error interno del servidor",
            error: error.message 
        });
    }
};

// Controlador para obtener todos los jugadores
export const fetchTodosLosJugadores = async (req, res) => {
    try {
        const data = await getTodosLosJugadores();
        
        res.json({
            success: true,
            message: "Todos los jugadores obtenidos exitosamente",
            data: data,
            count: data.length
        });

    } catch (error) {
        console.error("Error en fetchTodosLosJugadores:", error);
        res.status(500).json({ 
            success: false,
            message: "Error interno del servidor",
            error: error.message 
        });
    }
};

export const fetchJugadoresMongo = async (req, res) => {
  try {
    const data = await getJugadoresMongo();
    res.json({
      success: true,
      source: "MongoDB",
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("Error en fetchJugadoresMongo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const crearJugadorMongoController = async (req, res) => {
  try {
    const nuevoJugador = await crearJugadorMongo(req.body);
    res.status(201).json({
      success: true,
      message: "Jugador agregado correctamente a MongoDB",
      data: nuevoJugador,
    });
  } catch (error) {
    console.error("Error en crearJugadorMongoController:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const testController = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ 
            success: false,
            message: "Endpoint no disponible en producción" 
        });
    }

    try {
        const testResult = await testService();
        
        res.json({
            success: true,
            environment: process.env.NODE_ENV || 'development',
            ...testResult,
            endpoints: [
                'GET /api/jugadores/test - Prueba de funcionamiento',
                'GET /api/jugadores/todos - Obtener todos los jugadores',
                'GET /api/jugadores/buscar/:nombre - Buscar jugadores por nombre'
            ],
            examples: [
                'GET /api/jugadores/buscar/Juan',
                'GET /api/jugadores/buscar/Agustin',
                'GET /api/jugadores/buscar/Mar'
            ]
        });

    } catch (error) {
        console.error("Error en testController:", error);
        res.status(500).json({ 
            success: false,
            message: "Error en test del controlador",
            error: error.message 
        });
    }
};


