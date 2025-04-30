const db = require("../config/db");

module.exports = {
  findByCPF: (cpf, callback) => {
    db.get("SELECT * FROM usuarios WHERE cpf = ?", [cpf], callback);
  },
  createUser: (nome, cpf, senha, perfil, callback) => {
    db.run(
      "INSERT INTO usuarios (nome, cpf, senha, perfil) VALUES (?, ?, ?, ?)",
      [nome, cpf, senha, perfil],
      callback
    );
  },
  // Adicione mais métodos: listAll, findById, update, delete...
    listAll: (callback) => {
        db.all("SELECT * FROM usuarios", [], callback);
    },
    findById: (id, callback) => {
        db.get("SELECT * FROM usuarios WHERE id = ?", [id], callback);
    },
    update: (id, nome, cpf, senha, perfil, callback) => {
        db.run(
            "UPDATE usuarios SET nome = ?, cpf = ?, senha = ?, perfil = ? WHERE id = ?",
            [nome, cpf, senha, perfil, id],
            callback
        );
    },
    delete: (id, callback) => {
        db.run("DELETE FROM usuarios WHERE id = ?", [id], callback);
    },
};
