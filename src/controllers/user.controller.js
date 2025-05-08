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
        usuario: req.session.user || null,
      });
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    
    // Verifica qual rota foi acessada
    const isUpdateRoute = req.path.includes('updateUser');
    const viewTemplate = isUpdateRoute ? 'updateUser' : 'userDetails';
    
    usersDAO.findById(id, (err, usuario) => {
      if (err) {
        return res.status(500).send("Erro ao buscar usuário.");
      }
      
      if (!usuario) {
        return res.status(404).send("Usuário não encontrado.");
      }
      
      res.render(viewTemplate, { 
        user: usuario, 
        emails: usuario.emails || [], 
        telefones: usuario.telefones || [],
        erro: null,
        session: req.session
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
    const { nome, cpf, senha, perfil } = req.body;

    // Pegamos os índices dos principais
    const emailPrincipalIndex = req.body.emailPrincipal;
    const telefonePrincipalIndex = req.body.telefonePrincipal;

    // Processa os e-mails
    const emails = Array.isArray(req.body.emails)
      ? req.body.emails.map((email, index) => ({
          email: email.email || email, // Suporte para strings ou objetos
          principal: req.body.emailPrincipal == index ? "1" : "0", // Define o principal pelo índice
        }))
      : [];

    // Processa os telefones - usando a mesma abordagem que os e-mails
    const telefones = Array.isArray(req.body.telefones)
      ? req.body.telefones.map((telefone, index) => ({
          telefone: telefone.telefone || telefone, // Suporte para strings ou objetos
          principal: req.body.telefonePrincipal == index ? "1" : "0", // Define o principal pelo índice
        }))
      : [];

    // Validação
    const emailPrincipal = emails.find((email) => email.principal === "1");
    const telefonePrincipal = telefones.find((tel) => tel.principal === "1");

    if (!emailPrincipal || !telefonePrincipal) {
      return res.status(400).json({
        erro: "É necessário definir um e-mail e um telefone principais.",
      });
    }

    // 🔍 Verifica se já existe algum usuário cadastrado
    usersDAO.countUsers((err, totalUsuarios) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao contar usuários." });
      }

      // Se for o primeiro usuário, forçamos o perfil para ADMIN
      const perfilFinal = totalUsuarios === 0 ? "ADMIN" : perfil;

      // 🔍 Verifica duplicidade de CPF
      usersDAO.findByCPF(cpf, (err, existingUser) => {
        if (err) {
          return res.status(500).json({ erro: "Erro ao verificar CPF." });
        }

        if (existingUser) {
          return res
            .status(400)
            .json({ erro: "CPF já cadastrado no sistema." });
        }

        // ✅ Criação do usuário
        usersDAO.createUser(
          { nome, cpf, senha, perfil: perfilFinal },
          (err, userId) => {
            if (err)
              return res.status(500).json({ erro: "Erro ao criar usuário." });

            emails.forEach((email) => {
              usersDAO.createEmail(
                userId,
                email.email,
                email.principal === "1"
              );
            });

            telefones.forEach((telefone) => {
              usersDAO.createTelefone(
                userId,
                telefone.telefone,
                telefone.principal === "1"
              );
            });

            req.session.mensagem = "Usuário cadastrado com sucesso!";
            res.redirect("/home");
          }
        );
      });
    });
  },

  update: (req, res) => {
    const idParaEditar = req.params.id;
    const usuarioLogado = req.session.user;

    // Verifica permissões
    if (
      usuarioLogado.perfil !== "ADMIN" &&
      usuarioLogado.id !== parseInt(idParaEditar)
    ) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para editar este usuário." });
    }

    // Desestrutura os campos permitidos
    const { nome, senha } = req.body;

    // Processa os e-mails
    const emails = Array.isArray(req.body.emails)
      ? req.body.emails.map((email, index) => ({
          email: email.email || email, // Suporte para strings ou objetos
          principal: req.body.emailPrincipal == index ? "1" : "0", // Define o principal pelo índice
        }))
      : [];

    // Processa os telefones - usando a mesma abordagem que os e-mails
    const telefones = Array.isArray(req.body.telefones)
      ? req.body.telefones.map((telefone, index) => ({
          telefone: telefone.telefone || telefone, // Suporte para strings ou objetos
          principal: req.body.telefonePrincipal == index ? "1" : "0", // Define o principal pelo índice
        }))
      : [];

    // Validação
    const emailPrincipal = emails.find((email) => email.principal === "1");
    const telefonePrincipal = telefones.find((tel) => tel.principal === "1");

    if (!emailPrincipal || !telefonePrincipal) {
      return res.status(400).json({
        erro: "É necessário definir um e-mail e um telefone principais.",
      });
    }

    // Verifica se a senha foi enviada
    const senhaAtualizada = senha ? bcrypt.hashSync(senha, 10) : undefined;

    // Atualiza o usuário
    usersDAO.updateUser(
      idParaEditar,
      { nome, senha: senhaAtualizada, emails, telefones },
      (err) => {
        if (err) {
          return res.status(500).json({ erro: "Erro ao atualizar o usuário." });
        }
        res.redirect("/user/" + idParaEditar);
      }
    );
  },

  delete: (req, res) => {
    const idParaDeletar = req.params.id;
    const usuarioLogado = req.session.user;

    // Verifica permissões
    if (usuarioLogado.perfil !== "ADMIN") {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para excluir este usuário." });
    }

    // Chama o DAO para deletar o usuário
    usersDAO.deleteUser(idParaDeletar, (err) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao excluir o usuário." });
      }
      res.redirect("/users");
    });
  },
};

module.exports = usersController;
