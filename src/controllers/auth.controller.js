const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

/**
 * Controlador de autenticação.
 * Contém as funções de login e logout.
 */
const authController = {
  /**
   * Realiza o login do usuário.
   * @param {Object} req - Objeto de requisição.
   * @param {Object} res - Objeto de resposta.
   */
  login: (req, res) => {
    const { cpf, senha } = req.body;

    // Busca o usuário pelo CPF no banco de dados
    userModel.findByCPF(cpf, async (err, usuario) => {
      if (err || !usuario) {
        return res.render("login", { erro: "Usuário não encontrado.", titulo: "Login" });
      }

      // Compara a senha fornecida com a senha criptografada armazenada no banco
      const match = await bcrypt.compare(senha, usuario.senha);
      if (!match) {
        return res.render("login", { erro: "Senha incorreta.", titulo: "Login" });
      }

      // Se as credenciais estiverem corretas, cria a sessão do usuário
      req.session.user = {
        id: usuario.id,
        nome: usuario.nome,
        perfil: usuario.perfil,
      };

      // Redireciona para a página inicial (home)
      res.redirect("/home");
    });
  },

  /**
   * Realiza o logout do usuário.
   * @param {Object} req - Objeto de requisição.
   * @param {Object} res - Objeto de resposta.
   */
  logout: (req, res) => {
    // Destroi a sessão do usuário e redireciona para a página de login
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Erro ao encerrar a sessão");
      }
      res.redirect("/login");
    });
  },
};

module.exports = authController;
