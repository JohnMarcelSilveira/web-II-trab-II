const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const {
  verificarLogin,
  verificarAdmin,
} = require("../middlewares/authMiddleware");

// Autenticação
router.get("/login", (req, res) => res.render("login", { titulo: "Login", erro: null }));
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

// Usuários
/*
router.get("/addUser", userController.renderAddForm);
router.post("/addUser", userController.create);
// ... outras rotas de CRUD
router.get("/editUser/:id", userController.renderEditForm);
router.post("/editUser/:id", userController.update);
router.get("/deleteUser/:id", userController.deleteUser);
router.get("/searchUser", userController.searchUser);
router.post("/searchUser", userController.searchUserPost);
router.get("/searchUser/:id", userController.searchUserId);
router.post("/searchUser/:id", userController.searchUserIdPost);
router.get("/searchUser/:id/edit", userController.searchUserIdEdit);
router.post("/searchUser/:id/edit", userController.searchUserIdEditPost);
router.get("/searchUser/:id/delete", userController.searchUserIdDelete);
router.post("/searchUser/:id/delete", userController.searchUserIdDeletePost);
router.get("/searchUser/:id/view", userController.searchUserIdView);
router.post("/searchUser/:id/view", userController.searchUserIdViewPost);
router.get("/searchUser/:id/confirm", userController.searchUserIdConfirm);
router.post("/searchUser/:id/confirm", userController.searchUserIdConfirmPost);
router.get("/searchUser/:id/confirm/edit", userController.searchUserIdConfirmEdit);
*/

module.exports = router;
