const db = require("../config/db");
const bcrypt = require("bcrypt");
const { hashSync } = require("bcrypt");

const usersDao = {
  findByCPF(cpf, callback) {
    db.prepare("SELECT * FROM usuarios WHERE cpf = ?").get(cpf, callback);
  },

  createUser(user, callback) {
    try {
      const insertUser = `INSERT INTO usuarios (nome, cpf, senha, perfil) VALUES (?, ?, ?, ?)`;
      const stmt = db.prepare(insertUser);

      stmt.run(user.nome, user.cpf, hashSync(user.senha, 10), user.perfil);

      // Usando stmt.get() para pegar o id depois da inserção
      db.prepare("SELECT last_insert_rowid()").get((err, row) => {
        if (err) {
          callback(err);
        } else {
          console.log("ID do usuário inserido:", row["last_insert_rowid()"]);
          callback(null, row["last_insert_rowid()"]);
        }
      });
    } catch (err) {
      console.error("Erro no createUser:", err);
      callback(err);
    }
  },
  listAllFiltrado(filtro, limite, offset, callback) {
    const filtroLike = `%${filtro}%`;

    const queryUsuarios = `
    SELECT * FROM usuarios
    WHERE nome LIKE ?
    LIMIT ? OFFSET ?
  `;

    const queryTotal = `
    SELECT COUNT(*) AS total FROM usuarios
    WHERE nome LIKE ?
  `;

    db.all(queryUsuarios, [filtroLike, limite, offset], (err, rows) => {
      if (err) return callback(err);

      db.get(queryTotal, [filtroLike], (err2, result) => {
        if (err2) return callback(err2);

        callback(null, rows, result.total);
      });
    });
  },

  findById(id, callback) {
    const usuarioSQL = `SELECT * FROM usuarios WHERE id = ?`;
    const emailsSQL = `SELECT * FROM emails WHERE usuario_id = ?`;
    const telefonesSQL = `SELECT * FROM telefones WHERE usuario_id = ?`;

    db.get(usuarioSQL, [id], (err, usuario) => {
      if (err || !usuario)
        return callback(err || new Error("Usuário não encontrado"));

      db.all(emailsSQL, [id], (errEmails, emails) => {
        if (errEmails) return callback(errEmails);

        db.all(telefonesSQL, [id], (errTels, telefones) => {
          if (errTels) return callback(errTels);

          // Juntando tudo em um único objeto
          usuario.emails = emails;
          usuario.telefones = telefones;

          callback(null, usuario);
        });
      });
    });
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

  createEmail(userId, email, principal) {
    const insertEmail = `INSERT INTO emails (usuario_id, email, principal) VALUES (?, ?, ?)`;
    db.prepare(insertEmail).run(userId, email, principal ? 1 : 0);
  },

  createTelefone(userId, telefone, principal) {
    const insertTelefone = `INSERT INTO telefones (usuario_id, telefone, principal) VALUES (?, ?, ?)`;
    db.prepare(insertTelefone).run(userId, telefone, principal ? 1 : 0);
  },
};

module.exports = usersDao;
