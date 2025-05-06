const verificarLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login"); 
  }
  next();
};


const verificarAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.perfil !== "ADMIN") {
    return res.status(403).send("Acesso negado."); // Retorna erro se não for admin
  }
  next(); 
};

module.exports = { verificarLogin, verificarAdmin };
