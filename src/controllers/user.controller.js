const { hashSync } = require('bcrypt');
const usersDAO = require('../models/user.model');

const usersController = {
  getAll: (req, res) => {
    const resultado = usersDAO.findAll();
    res.json(resultado);
  },
  create: async (req, res) => {
    console.log({ body: req.body });
    const user = req.body;

    // user.password = hashSync(user.password, 10);

    usersDAO.createUser(user);
    res.send("ADICIONANDO UM USUARIO");
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
