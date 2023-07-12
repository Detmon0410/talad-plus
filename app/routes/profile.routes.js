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
  router.post(
    "/report",
    [authJwt.verifyToken],
    profileController.reportProfile
  );
  router.get("/:user", [authJwt.verifyToken], profileController.getMyProfile);
  router.patch("/:id/", [authJwt.verifyToken], profileController.editProfile);
  router.get("/:id/report", [authJwt.verifyToken], profileController.getReport);
  router.post(
    "/register",
    [authJwt.verifyToken],
    profileController.createProfile
  );
  router.get(
    "/user/substall",
    [authJwt.verifyToken],
    profileController.getSubstall
  );
  router.post(
    "/registerm",
    [authJwt.verifyToken],
    profileController.merchantregister
  );

  router.get(
    "/receipt/:stallId",
    [authJwt.verifyToken],
    profileController.getSelectedStall
  );

  router.post(
    "/favorite",
    [authJwt.verifyToken],
    profileController.favoriteMarket
  );

  router.post(
    "/deletefavorite",
    [authJwt.verifyToken],
    profileController.deletefavoriteMarket
  );

  router.get(
    "/user/myfavorite",
    [authJwt.verifyToken],
    profileController.getMyFavorite
  );
  app.use("/apis/profile", router);
};
