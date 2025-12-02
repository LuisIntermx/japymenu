import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  creadoEn: { type: Date, default: Date.now },
});

const Usuario =
  mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
