const express = require("express");
const session = require("express-session");
const app = express();
const routes = require("./routes/index.routes");
const db = require("./config/dbConnection");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "segredo_seguro",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", routes);

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);
