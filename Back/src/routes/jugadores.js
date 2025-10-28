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
router.get('/test', testController);               
router.get('/todos', fetchTodosLosJugadores);         
router.get('/buscar/:nombre', fetchJugadoresPorNombre); 

// Rutas Mongo

router.get("/mongo/todos", fetchJugadoresMongo);
router.post("/mongo", crearJugadorMongoController);

export default router;