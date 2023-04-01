require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const fileUpload = require("express-fileupload");
const app = express();

//enable dotenv
require("dotenv").config();

// give permission for fetch resource
// https://acoshift.me/2019/0004-web-cors.html
// https://stackabuse.com/handling-cors-with-node-js/
const corsOptions = {
  origin: process.env.ALLOW_URLS.split(",").map((d) => {
    return new RegExp(`${d.replace(/http:\/\/|https:\/\/|\//g, "")}$`);
  }),
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// enabled file upload
app.use(
  fileUpload({
    limits: {
      fileSize: 100000000, //100mb
    },
  })
);

// routes
// require("./app/routes/auth.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/market.routes")(app);
require("./app/routes/management.routes")(app);
require("./app/routes/profile.routes")(app);

// redirect all other route to frontend
// app.get("*", function (req, res) {
//   res.redirect(process.env.ALLOW_URLS);
// });

// set port, listen for requests
const port = process.env.SERVER_PORT;
server = app.listen(port, () => console.log("server running on port " + port));

// connect to database
db.mongoose
  .set("strictQuery", true)
  .connect(process.env.DB)
  .then(() => {
    new db.mongoose.mongo.Admin(db.mongoose.connection.db).buildInfo(
      async function (err, info) {
        console.log("Successfully connect to MongoDB version " + info.version);
        const soil = db.soil;
      }
    );
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

module.exports = app;
