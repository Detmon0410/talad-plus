module.exports = function (app) {
  var router = require("express").Router();
  const authController = require("../controllers/auth.controller");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/register", authController.register);
  router.post("/login", authController.login);

  app.use("/apis/auth", router);
};
