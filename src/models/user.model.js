const db = require("../config/db");
const bcrypt = require("bcrypt");
const { hashSync } = require("bcrypt");

/**
 * Modelo de Usuários.
 * Contém funções para manipulação de dados no banco de dados.
 */
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

  /**
   * Busca um usuário pelo ID.
   * @param {number} id - ID do usuário.
   * @param {Function} callback - Função de callback para retornar o resultado.
   */
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

  /**
   * Atualiza os dados de um usuário.
   * @param {number} id - ID do usuário.
   * @param {Object} data - Dados do usuário (nome, senha, emails, telefones).
   * @param {Function} callback - Função de callback para retornar o resultado.
   */
  updateUser(id, { nome, senha, emails, telefones }, callback) {
    const sqlUpdateUser = senha
      ? `UPDATE usuarios SET nome = ?, senha = ? WHERE id = ?`
      : `UPDATE usuarios SET nome = ? WHERE id = ?`;

    const params = senha ? [nome, senha, id] : [nome, id];

    // Atualiza os dados do usuário
    db.run(sqlUpdateUser, params, (err) => {
      if (err) return callback(err);

      // Remove os e-mails antigos
      const sqlDeleteEmails = `DELETE FROM emails WHERE usuario_id = ?`;
      db.run(sqlDeleteEmails, [id], (err) => {
        if (err) return callback(err);

        // Insere os novos e-mails
        const sqlInsertEmail = `INSERT INTO emails (usuario_id, email, principal) VALUES (?, ?, ?)`;
        emails.forEach((email) => {
          db.run(sqlInsertEmail, [id, email.email, email.principal === "1" ? 1 : 0]);
        });

        // Remove os telefones antigos
        const sqlDeleteTelefones = `DELETE FROM telefones WHERE usuario_id = ?`;
        db.run(sqlDeleteTelefones, [id], (err) => {
          if (err) return callback(err);

          // Insere os novos telefones
          const sqlInsertTelefone = `INSERT INTO telefones (usuario_id, telefone, principal) VALUES (?, ?, ?)`;
          telefones.forEach((telefone) => {
            db.run(sqlInsertTelefone, [id, telefone.telefone, telefone.principal === "1" ? 1 : 0]);
          });

          // Finaliza o callback após todas as operações
          callback(null);
        });
      });
    });
  },

  deleteEmails: (userId) => {
    db.run(`DELETE FROM emails WHERE usuario_id = ?`, [userId]);
  },

  deleteTelefones: (userId) => {
    db.run(`DELETE FROM telefones WHERE usuario_id = ?`, [userId]);
  },

  deleteUser: (id, callback) => {
    // Remove os e-mails do usuário
    const sqlDeleteEmails = `DELETE FROM emails WHERE usuario_id = ?`;
    db.run(sqlDeleteEmails, [id], (err) => {
      if (err) return callback(err);

      // Remove os telefones do usuário
      const sqlDeleteTelefones = `DELETE FROM telefones WHERE usuario_id = ?`;
      db.run(sqlDeleteTelefones, [id], (err) => {
        if (err) return callback(err);

        // Remove o usuário
        const sqlDeleteUser = `DELETE FROM usuarios WHERE id = ?`;
        db.run(sqlDeleteUser, [id], (err) => {
          if (err) return callback(err);

          callback(null);
        });
      });
    });
  },

  createEmail(userId, email, principal) {
    const insertEmail = `INSERT INTO emails (usuario_id, email, principal) VALUES (?, ?, ?)`;
    db.prepare(insertEmail).run(userId, email, principal ? 1 : 0);
  },

  createTelefone(userId, telefone, principal) {
    const insertTelefone = `INSERT INTO telefones (usuario_id, telefone, principal) VALUES (?, ?, ?)`;
    db.prepare(insertTelefone).run(userId, telefone, principal ? 1 : 0);
  },

  countUsers: (callback) => {
    const sql = "SELECT COUNT(*) AS total FROM usuarios";
    db.get(sql, (err, row) => {
      if (err) return callback(err);
      callback(null, row.total);
    });
  },
};

module.exports = usersDao;
