import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectDB } from "./src/config/db.js"; // conexión MySQL
//import { conectarMongo } from "./src/config/dbMongo.js"; 

import jugadoresRoutes from "./src/routes/jugadores.js";
import authRoutes from "./src/routes/AuthR.js";
import dashboardRoutes from "./src/routes/dashboardR.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middleware para JSON y CORS
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("¡El servidor está funcionando!");
});

app.use("/api", authRoutes);
app.use("/api/jugadores", jugadoresRoutes);
app.use("/api/dashboard", dashboardRoutes);

const startServer = async () => {
  try {
    await connectDB(); // MySQL
    //await conectarMongo(); // MongoDB

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor escuchando en http://${HOST}:${PORT}`);
      console.log(`📡 Accesible desde la red`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();