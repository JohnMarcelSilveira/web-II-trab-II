const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const authController = {

  login: (req, res) => {
    const { cpf, senha } = req.body;

    // Busca o usuário pelo CPF no banco de dados
    userModel.findByCPF(cpf, async (err, usuario) => {
      if (err || !usuario) {
        // Se não encontrar o usuário, retorna a página de login com erro
        return res.render("login", { erro: "Usuário não encontrado.", titulo: "Login" });
      }

      // Compara a senha fornecida com a senha criptografada armazenada no banco
      const match = await bcrypt.compare(senha, usuario.senha);
      if (!match) {
        // Se a senha não coincidir, retorna a página de login com erro
        return res.render("login", { erro: "Senha incorreta.", titulo: "Login" });
      }

      // Se as credenciais estiverem corretas, cria a sessão do usuário
      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        perfil: usuario.perfil,
      };

      // Redireciona para a página inicial (home)
      res.redirect("/home");
    });
  }, 
  logout: (req, res) => {
    // Destroi a sessão do usuário e redireciona para a página de login
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Erro ao encerrar a sessão");
      }
      res.redirect("/login");
    });
  }
};

module.exports = authController;
