const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Definindo o caminho do banco de dados
const dbPath = path.resolve(__dirname, "..", "db.sqlite");

// Criando a conexão com o banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar com o banco de dados", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite");
  }
});

// Função para rodar o arquivo SQL e criar as tabelas
const runSQLFile = () => {
  const sqlPath = path.resolve(
    __dirname,
    "..",
    "src",
    "migrations",
    "create_tables.sql"
  ); // Corrigido o caminho aqui

  fs.readFile(sqlPath, "utf8", (err, sql) => {
    if (err) {
      console.error("Erro ao ler o arquivo SQL", err.message);
      return;
    }

    db.exec(sql, (err) => {
      if (err) {
        console.error("Erro ao executar o SQL", err.message);
      } else {
        console.log("Banco de dados e tabelas criadas com sucesso");
      }
    });
  });
};

// Rodando o SQL assim que a conexão for estabelecida
runSQLFile();

module.exports = db;
