module.exports = function (app) {
  var router = require("express").Router();
  const marketController = require("../controllers/market.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/", marketController.getAllMarket);
  router.get("/donate", marketController.getMarketDonatePriority);
  router.get("/near", marketController.getMarketNearMe);
  router.post("/register", authJwt.verifyToken, marketController.register);
  router.patch("/:id", marketController.editMarket);
  router.delete("/:id", marketController.deteleMarket);

  router.patch("/:id/setdonate", marketController.setDonate);
  router.post(
    "/:id/review",
    authJwt.verifyToken,
    marketController.ReviewMarket
  );
  router.get(
    "/:marketId/review",
    authJwt.verifyToken,
    marketController.getReview
  );

  app.use("/apis/market", router);
};
