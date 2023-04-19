module.exports = function (app) {
  var router = require("express").Router();
  const profileController = require("../controllers/profile.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/:user", [authJwt.verifyToken], profileController.getMyProfile);
  router.patch("/:id/", [authJwt.verifyToken], profileController.editProfile);
  router.post(
    "/:register",
    [authJwt.verifyToken],
    profileController.createProfile
  );
  router.post(
    "/:user/:report",
    [authJwt.verifyToken],
    profileController.reportProfile
  );
  router.get(
    "/:user/substall",
    [authJwt.verifyToken],
    profileController.getSubstall
  );
  router.get(
    "/:user/getreport",
    [authJwt.verifyToken],
    profileController.getReport
  );
  router.post(
    "/registerm",
    [authJwt.verifyToken],
    profileController.merchantregister
  );

  app.use("/apis/profile", router);
};