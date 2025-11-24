const { User, Role, Emprunt, Livre } = require("../models");

const findByEmail = (email) =>
  User.findOne({ where: { email }, include: Role });

const createUser = (data) => User.create(data);

const findById = (id_user) => User.findByPk(id_user, { include: Role });

const findAllUsers = async () => {
  return User.findAll({
    include: [
      Role,
      {
        model: Emprunt,
        include: [Livre],
      },
    ],
  });
};
module.exports = { findByEmail, createUser, findById, findAllUsers };
