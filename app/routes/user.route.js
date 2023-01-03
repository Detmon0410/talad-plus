module.exports = function (app) {
  var router = require("express").Router();
  const userController = require("../controllers/user.controller");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/register", userController.register);
  router.post("/login", userController.login);

  app.use("/apis/user", router);
};
