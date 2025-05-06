module.exports = (req, res, next) => {
  res.locals.usuario = req.session.user || null;
  next();
};
