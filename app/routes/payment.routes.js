module.exports = function (app) {
    var router = require("express").Router();
    const paymentController = require("../controllers/payment.controller");
    const { authJwt } = require("../middlewares");
  
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    router.post("/:payment", [authJwt.verifyToken],paymentController.userPayment);
    router.patch("/:payment/paid", [authJwt.verifyToken],paymentController.addMoney);

    app.use("/apis/payment", router);
  };
  