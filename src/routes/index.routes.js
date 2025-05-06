const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const {
  verificarLogin,
  verificarAdmin,
} = require("../middlewares/authMiddleware");

// Autenticação
router.get("/login", (req, res) => res.render("login", { erro: null }));
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Página inicial
router.get("/home", verificarLogin, (req, res) => {
  res.render("home", { usuario: req.session.usuario });
});

// Cadastro de usuário
router.get("/addUser", (req, res) => {
  res.render("addUser", { erro: null });
});
router.post("/addUser", userController.create);
router.get("/users", verificarLogin, userController.getAll);
router.get("/viewUser/:id", userController.getById);
router.get("/updateUser/:id", verificarAdmin, userController.getById);
router.post("/updateUser/:id",verificarAdmin, userController.update);
// router.get("/deleteUser/:id", userController.deleteUser);
router.get("/deleteUser/:id",verificarAdmin, userController.delete);



module.exports = router;
