# 🧑‍💻 Sistema de Gerenciamento de Usuários (CRUD) – Node.js + Express + SQLite

## 📚 Descrição

Este projeto é uma aplicação web desenvolvida com **Node.js**, **Express**, **SQLite** e **EJS**, estruturada no padrão **MVC**, que permite a **gestão de usuários com autenticação, controle de sessão e permissões por perfil**.

### Funcionalidades Principais

- Autenticação via CPF e senha
- Sessões com controle por perfil (`ADMIN` e `CLIENTE`)
- Cadastro automático com definição de perfil
- Listagem com paginação (5 usuários por página) e filtro por nome
- Visualização de usuário com múltiplos emails e telefones
- Edição de usuários com controle de acesso
- Exclusão de usuários (com regras de permissão)
- Suporte a múltiplos telefones e emails por usuário, com indicação de principal

---

## 🧠 Regras de Negócio

- O primeiro usuário cadastrado é automaticamente `ADMIN`
- Os demais usuários são `CLIENTE`
- `CLIENTE` só pode editar os próprios dados
- `ADMIN` pode editar qualquer usuário, exceto excluir outros `ADMIN`
- CPF deve ser único e não pode ser alterado
- Apenas um telefone e um email podem ser definidos como principais por usuário

---

## 🏗️ Estrutura do Projeto (MVC)

```
projeto/
├── server.js                   # Inicialização da aplicação
├── dados.db                    # Banco de dados SQLite
├── package.json
├── README.md

├── public/                     # Arquivos estáticos (CSS, JS)

├── src/
│   ├── config/
│   │   └── db.js               # Conexão com banco de dados
│
│   ├── controllers/
│   │   ├── authController.js   # Login / Logout
│   │   └── userController.js   # CRUD de usuários
│
│   ├── models/
│   │   └── userModel.js        # Funções SQL
│
│   ├── routes/
│   │   └── index.js            # Rotas da aplicação
│
│   ├── middlewares/
│   │   └── authMiddleware.js   # Verificação de login/permissão
│
│   └── views/
│       ├── partials/           # Cabeçalho/Rodapé
│       ├── login.ejs
│       ├── home.ejs
│       ├── addUser.ejs
│       ├── users.ejs
│       ├── userDetails.ejs
│       └── updateUser.ejs
```

---

## 🚀 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o servidor

```bash
node server.js
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🔧 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [EJS](https://ejs.co/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [express-session](https://www.npmjs.com/package/express-session)

---

## 👥 Autores

- Jaime 
- John Silveira

---

## 📄 Licença

Este projeto é de uso acadêmico e segue os critérios da disciplina de Desenvolvimento Web II.