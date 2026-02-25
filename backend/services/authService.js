const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
require("dotenv").config();

// Validation du mot de passe fort
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/.test(
    password,
  );

  const errors = [];

  if (password.length < minLength) {
    errors.push(`au moins ${minLength} caractères`);
  }
  if (!hasUpperCase) {
    errors.push("une majuscule");
  }
  if (!hasLowerCase) {
    errors.push("une minuscule");
  }
  if (!hasNumber) {
    errors.push("un chiffre");
  }
  if (!hasSpecialChar) {
    errors.push("un caractère spécial (!@#$%^&*...)");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

const register = async (data) => {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) throw new Error("Email déjà utilisé");

  // Valider le mot de passe
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    throw new Error(
      `Le mot de passe doit contenir : ${passwordValidation.errors.join(", ")}`,
    );
  }

  const hash = await bcrypt.hash(data.password, 10);

  return userRepository.createUser({
    ...data,
    password: hash,
    id_role: 1,
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
    { expiresIn: "8h" },
  );

  const { password: pwd, Role, ...userData } = user.toJSON(); // on récupère Role aussi

  const userWithRole = {
    ...userData,
    id_role: Role?.id_role || user.id_role, // Role est là
  };

  return { token, user: userWithRole };
};

module.exports = { register, login };
