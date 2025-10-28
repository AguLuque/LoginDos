import { Router } from "express";
import {
  getDashboardStats,
  getUltimosJugadores,
  getPartidos,
  getTorneos,
} from "../service/dashboardS.js";

const router = Router();

// 📊 Estadísticas generales
router.get("/stats", async (req, res) => {
  try {
    const data = await getDashboardStats();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// 🧍 Últimos jugadores
router.get("/jugadores", async (req, res) => {
  try {
    const data = await getUltimosJugadores();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error obteniendo jugadores:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// ⚽ Últimos partidos
router.get("/partidos", async (req, res) => {
  try {
    const data = await getPartidos();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error obteniendo partidos:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// 🏆 Torneos jugados
router.get("/torneos", async (req, res) => {
  try {
    const data = await getTorneos();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error obteniendo torneos:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

export default router;
