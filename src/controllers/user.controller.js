const { hashSync } = require("bcrypt");
const usersDAO = require("../models/user.model");

const usersController = {
  getAll: (req, res) => {
    const pagina = parseInt(req.query.pagina) || 1;
    const filtro = req.query.nome || "";
    const limite = 5;
    const offset = (pagina - 1) * limite;

    usersDAO.listAllFiltrado(filtro, limite, offset, (err, users, total) => {
      if (err) {
        return res.status(500).send("Erro ao listar usuários.");
      }

      const temMais = total > pagina * limite;

      res.render("users", {
        users,
        pagina,
        temMais,
        filtro,
        session: req.session || {},
      });
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    usersDAO.findById(id, (err, usuario) => {
      if (err || !usuario)
        return res.status(404).json({ erro: "Usuário não encontrado." });

      res.render("userDetails", {
        user: usuario,
        emails: usuario.emails || [],
        telefones: usuario.telefones || [],
        session: req.session || {},
      });
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
