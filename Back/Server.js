// Archivo principal que levanta el servidor
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Importar la configuración de la base de datos
import { connectDB } from "./src/config/db.js"; // conexión MySQL
// import { conectarMongo } from "./src/config/dbMongo.js"; // ❌ COMENTADO

// Importar rutas
import jugadoresRoutes from "./src/routes/jugadores.js";
import authRoutes from "./src/routes/AuthR.js";
import dashboardRoutes from "./src/routes/dashboardR.js";

// Cargamos variables de entorno
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

// prueba
app.get("/", (req, res) => {
  res.send("¡El servidor está funcionando!");
});

// Rutas
app.use("/api", authRoutes);
app.use("/api/jugadores", jugadoresRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Función principal
const startServer = async () => {
  try {
    await connectDB(); // MySQL
    // await conectarMongo(); // ❌ COMENTADO - MongoDB

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor escuchando en http://${HOST}:${PORT}`);
      console.log(`📡 Accesible desde la red`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

// Iniciar
startServer();