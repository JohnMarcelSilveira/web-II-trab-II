const db = require("../config/db");
const bcrypt = require("bcrypt");
const { hashSync } = require("bcrypt");


const usersDao = {
  findByCPF(cpf, callback) {
    db.prepare("SELECT * FROM usuarios WHERE cpf = ?").get(cpf, callback);
  },

  createUser(user) {
    const insertUser = `INSERT INTO usuarios (nome, cpf, senha, perfil) VALUES (?, ?, ?, ?)`;
    db.prepare(insertUser).run(
      user.nome,
      user.cpf,
      hashSync(user.senha, 10),
      user.perfil
    );
  },

  listAll(callback) {
    db.prepare("SELECT * FROM usuarios").all(callback);
  },

  findById(id, callback) {
    db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id, callback);
  },

  update(user, callback) {
    const updateSQL = `
      UPDATE usuarios 
      SET nome = ?, cpf = ?, senha = ?, perfil = ?
      WHERE id = ?
    `;
    db.prepare(updateSQL).run(
      user.nome,
      user.cpf,
      hashSync(user.senha, 10),
      user.perfil,
      user.id,
      callback
    );
  },

  delete(id, callback) {
    db.prepare("DELETE FROM usuarios WHERE id = ?").run(id, callback);
  },
};

module.exports = usersDao;