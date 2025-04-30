# 🧑‍💻 CRUD de Usuários com Node.js, Express e SQLite

## 📋 Descrição

Este projeto é uma aplicação web desenvolvida com **Node.js**, **Express**, **SQLite** e **EJS**, que permite o **cadastro, listagem, visualização, atualização e exclusão de usuários**, com autenticação por CPF e controle de permissões por perfil (`ADMIN` ou `CLIENTE`).

## 🚀 Funcionalidades

- Login e logout com controle de sessão
- Cadastro automático do perfil (`ADMIN` no primeiro cadastro, demais como `CLIENTE`)
- Listagem de usuários com paginação e filtro por nome
- Visualização completa dos dados do usuário
- Atualização de dados com regras de acesso
- Exclusão de usuários (somente `ADMIN`, com restrições)
- Suporte a múltiplos telefones e emails por usuário (1 principal de cada)
- Interface feita com **EJS** e formulários HTML

## 🧠 Regras de Negócio

- CPF é único e obrigatório
- Campos `cpf` e `perfil` não podem ser alterados após cadastro
- Somente `ADMIN` pode editar ou excluir outros usuários
- `CLIENTE` só pode editar seus próprios dados
- `ADMIN` pode excluir a si mesmo, mas não outros `ADMIN`

## 🏗️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [EJS](https://ejs.co/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [express-session](https://www.npmjs.com/package/express-session)

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

# Instale as dependências
npm install

# Inicie o servidor
node app.js