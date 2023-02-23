module.exports = function (app) {
  var router = require("express").Router();
  const marketController = require("../controllers/market.controller");

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
  router.post("/register", marketController.register);
  router.patch("/:id", marketController.editMarket);
  router.delete("/:id", marketController.deteleMarket);
  router.post("/:id/stall", marketController.createStall);
  router.get("/:id/stall", marketController.getStall);
  router.patch("/:id/setdonate", marketController.setDonate);

  app.use("/apis/market", router);
};
