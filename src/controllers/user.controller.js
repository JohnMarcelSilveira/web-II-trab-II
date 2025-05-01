const { hashSync } = require("bcrypt");
const usersDAO = require("../models/user.model");

const usersController = {
  getAll: (req, res) => {
    usersDAO.listAll((err, rows) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao listar usuários." });
      res.json(rows);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    usersDAO.findById(id, (err, row) => {
      if (err || !row)
        return res.status(404).json({ erro: "Usuário não encontrado." });
      res.json(row);
    });
  },

  getByCPF: (req, res) => {
    const { cpf } = req.params;
    usersDAO.findByCPF(cpf, (err, row) => {
      if (err || !row)
        return res.status(404).json({ erro: "Usuário não encontrado." });
      res.json(row);
    });
  },

  create: (req, res) => {
    const user = req.body;
    usersDAO.createUser(user);
    res.send("Usuário criado com sucesso!");
  },

  update: (req, res) => {
    const { id } = req.params;
    const { nome, cpf, senha, perfil } = req.body;
    const senhaCriptografada = hashSync(senha, 10);

    usersDAO.update(id, nome, cpf, senhaCriptografada, perfil, (err) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao atualizar usuário." });
      res.send("Usuário atualizado com sucesso!");
    });
  },

  delete: (req, res) => {
    const { id } = req.params;
    usersDAO.delete(id, (err) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao deletar usuário." });
      res.send("Usuário deletado com sucesso!");
    });
  },
};

module.exports = usersController;

// exports.addUser = async (req, res) => {
//   const { nome, cpf, senha } = req.body;

//   if (!nome || !cpf || !senha) {
//     return res.send('Preencha todos os campos.');
//   }

//   // Verifica se CPF já existe
//   db.get('SELECT * FROM usuarios WHERE cpf = ?', [cpf], async (err, row) => {
//     if (err) return res.send('Erro ao verificar CPF.');
//     if (row) return res.send('Erro: CPF já cadastrado.');

//     // Verifica se é o primeiro usuário
//     db.get('SELECT COUNT(*) as total FROM usuarios', async (err, result) => {
//       if (err) return res.send('Erro ao contar usuários.');

//       const perfil = result.total === 0 ? 'ADMIN' : 'CLIENTE';
//       const senhaCriptografada = await bcrypt.hash(senha, 10);

//       db.run(
//         'INSERT INTO usuarios (nome, cpf, senha, perfil) VALUES (?, ?, ?, ?)',
//         [nome, cpf, senhaCriptografada, perfil],
//         function (err) {
//           if (err) return res.send('Erro ao cadastrar usuário.');
//           res.redirect('/login');
//         }
//       );
//     });
//   });
// };
