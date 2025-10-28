import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const mongoUrl = process.env.MONGO_URL;

export const conectarMongo = async () => {
  try {
    if (!mongoUrl) {
      console.error("❌ MONGO_URL no está definida en el archivo .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUrl);
    console.log("✅ Conectado correctamente a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
