const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../dados.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  }
  console.log("Conectado ao banco de dados SQLite.");
}
);

module.exports = db;
