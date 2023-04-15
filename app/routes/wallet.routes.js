module.exports = function (app) {
    var router = require("express").Router();
    const walletController = require("../controllers/wallet.controller");
    const { authJwt } = require("../middlewares");
  
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    router.post("/:create", [authJwt.verifyToken],walletController.createWallet);
    router.get("/:user", [authJwt.verifyToken],walletController.getMyWallet);
    router.patch("/:user/withdraw", [authJwt.verifyToken],walletController.Withdraw);

    app.use("/apis/wallet", router);
  };
  