import "dotenv/config";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { authModel } from "../models/auth.model.js";
import { isValidEmail } from "../utils/validators/email.validate.js";

const login = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await authModel.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const payload = { email, id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ email, token });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await authModel.getUserByEmail(email);
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    const newUser = { 
      email, 
      password,
      name: "",
      phone: "",
      address: "",
      profileImage: "", 
      id: nanoid() 
    };

    await authModel.addUser(newUser);

    const payload = { email, id: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ email, token });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;
    const { email } = req.user;

    const user = await authModel.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Actualizar los datos del usuario
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.profileImage = profileImage || user.profileImage;

    await authModel.updateUser(user); 

    return res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};

const me = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await authModel.getUserByEmail(email);
    return res.json({ email, id: user.id });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const authController = {
  login,
  register,
  me,
  updateProfile
};
