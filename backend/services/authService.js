const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { v4: uuidv4 } = require("uuid"); // Pour générer un identifiant unique
require("dotenv").config();

const register = async (data) => {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) throw new Error("Email déjà utilisé");

  const hash = await bcrypt.hash(data.password, 10);

  const card_number = uuidv4();

  return userRepository.createUser({
    ...data,
    password: hash,
    id_role: 1,
    card_number,
  });
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("Utilisateur introuvable");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Mot de passe incorrect");

  const token = jwt.sign(
    { id_user: user.id_user, id_role: user.id_role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  const { password: pwd, Role, ...userData } = user.toJSON(); // on récupère Role aussi

  const userWithRole = {
    ...userData,
    id_role: Role?.id_role || user.id_role, // Role est là
  };

  return { token, user: userWithRole };
};

module.exports = { register, login };
