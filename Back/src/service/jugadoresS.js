import pool from "../config/db.js";
import { JugadorMongo } from "../models/JugadorMongo.js"; 


// Servicio para buscar jugadores por nombre
export const getJugadoresPorNombre = async (nombre) => {
  try {
    const [results] = await pool.execute("CALL JugadorPorNombre(?)", [nombre]);
    return results[0];
  } catch (error) {
    console.error("Error en JugadorPorNombre:", error);
    throw new Error(`Error al buscar jugadores: ${error.message}`);
  }
};

// Servicio para obtener todos los jugadores
export const getTodosLosJugadores = async () => {
  try {
    const [results] = await pool.execute("CALL JugadorPorNombre(?)", [""]);
    return results[0];
  } catch (error) {
    console.error("Error en TodosLosJugadores:", error);
    throw new Error(`Error al obtener todos los jugadores: ${error.message}`);
  }
};

export const testService = async () => {
  try {
    const [results] = await pool.execute("SELECT 1 as test");
    return {
      message: "Servicio de jugadores funcionando correctamente",
      database_connection: "OK",
      test_query: results[0],
    };
  } catch (error) {
    console.error("Error en testService:", error);
    throw new Error(`Error en test de servicio: ${error.message}`);
  }
};


// Obtener todos los jugadores desde Mongo
export const getJugadoresMongo = async () => {
  try {
    const jugadores = await JugadorMongo.find();
    return jugadores;
  } catch (error) {
    console.error("Error al obtener jugadores desde Mongo:", error);
    throw new Error(`Error Mongo: ${error.message}`);
  }
};

// Insertar jugador en Mongo
export const crearJugadorMongo = async (jugadorData) => {
  try {
    const nuevoJugador = new JugadorMongo(jugadorData);
    await nuevoJugador.save();
    return nuevoJugador;
  } catch (error) {
    console.error("Error al guardar jugador en Mongo:", error);
    throw new Error(`Error al guardar en Mongo: ${error.message}`);
  }
};


