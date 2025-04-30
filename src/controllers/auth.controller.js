const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  const { cpf, senha } = req.body;

  userModel.findByCPF(cpf, async (err, usuario) => {
    if (err || !usuario)
      return res.render("login", { erro: "Usuário não encontrado." });

    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.render("login", { erro: "Senha incorreta." });

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      perfil: usuario.perfil,
    };
    res.redirect("/home");
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
