exports.verificarLogin = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login");
};

exports.verificarAdmin = (req, res, next) => {
  if (req.session.user?.perfil === "ADMIN") return next();
  res.status(403).send("Acesso negado");
};
