import express from 'express';
import { 
    fetchJugadoresPorNombre, 
    fetchTodosLosJugadores, 
    testController,
      fetchJugadoresMongo,
  crearJugadorMongoController,
} from '../controllers/jugadorC.js';

const router = express.Router();

// Rutas MySQL
router.get('/test', testController);                    // GET /api/jugadores/test
router.get('/todos', fetchTodosLosJugadores);          // GET /api/jugadores/todos  
router.get('/buscar/:nombre', fetchJugadoresPorNombre); // GET /api/jugadores/buscar/:nombre

// Rutas Mongo

router.get("/mongo/todos", fetchJugadoresMongo);
router.post("/mongo", crearJugadorMongoController);

export default router;