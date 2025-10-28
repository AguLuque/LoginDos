import mongoose from "mongoose";

const jugadorSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: String,
  email: String,
  fecha_nacimiento: Date
});

export const JugadorMongo = mongoose.model("JugadorMongo", jugadorSchema, "Jugador");
