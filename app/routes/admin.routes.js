module.exports = function (app) {
    var router = require("express").Router();
    const adminController = require("../controllers/admin.controller");
    const { authJwt } = require("../middlewares");
  
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    router.get("/withdraw", adminController.getMyWithdraw);
    router.patch("/:withdraw/approve", [authJwt.verifyToken],adminController.approveTransfer);
    router.patch("/:withdraw/reject", [authJwt.verifyToken],adminController.rejectTransfer);
  
    app.use("/apis/admin", router);
  };
  