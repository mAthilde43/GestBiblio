const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepository");

const register = async (data) => {
  const hash = await bcrypt.hash(data.password, 10);
  return userRepo.createUser({ ...data, password: hash });
};

const login = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Utilisateur introuvable");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Mot de passe incorrect");

  const token = jwt.sign(
    { id_user: user.id_user, id_role: user.id_role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token, user };
};

module.exports = { register, login };
