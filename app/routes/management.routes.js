module.exports = function (app) {
  var router = require("express").Router();
  const manageController = require("../controllers/manage.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/market", [authJwt.verifyToken], manageController.getMyMarket);

  router.post(
    "/market/:marketId/stall",
    [authJwt.verifyToken],
    manageController.createStall
  );

  router.get(
    "/market/:marketId/getstall",
    [authJwt.verifyToken],
    manageController.getStallAll
  );

  router.post(
    "/market/:marketId/stall/:stallId/rent",
    [authJwt.verifyToken],
    manageController.rentStall
  );
  router.get(
    "/market/:marketId/stall/:stallId/rent",
    [authJwt.verifyToken],
    manageController.rentedStallList
  );
  router.get(
    "/market/:marketId/stall/:stallId/getsubstall",
    [authJwt.verifyToken],
    manageController.getSubStall
  );

  router.post(
    "/market/:marketId/stall/changestatus",
    [authJwt.verifyToken],
    manageController.rentedMultipleStatusChange
  );
  router.delete(
    "/market/:marketId/stall/reject",
    [authJwt.verifyToken],
    manageController.deteleSubStall
  );

  router.get(
    "/mprofile/:marketId",
    [authJwt.verifyToken],
    manageController.getSelectedMarket
  );
  router.get(
    "/user/stall/all",
    [authJwt.verifyToken],
    manageController.userRentedStallList
  );

  router.delete(
    "/delete",
    [authJwt.verifyToken],
    manageController.deteleSubStall
  );

  app.use("/apis/manage", router);
};
