const express = require("express");
const session = require("express-session");
const app = express();
const routes = require("./routes/index.routes");
const path = require("path");
const setUsuario = require("./middlewares/setUsuario");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "segredo_seguro",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(setUsuario);

app.use("/", routes);

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);
