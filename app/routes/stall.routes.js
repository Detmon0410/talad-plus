module.exports = function (app) {
  var router = require("express").Router();
  const stallController = require("../controllers/stall.controller");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/:id", stallController.getStall);

  app.use("/apis/stall", router);
};
