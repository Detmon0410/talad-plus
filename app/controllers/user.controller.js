const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = db.user;

//api login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(404)
        .send({ message: "Username or Password is incorrect or not found" });
    }
    bcrypt.compare(password, user.password, function (err, res) {
      if (err) {
        return res
          .status(404)
          .send({ message: "Username or Password is incorrect or not found" });
      }
    });
    if (user.role == "01") {
      res
        .status(200)
        .send({ message: "welcome " + user.name + " as merchant" });
    }
    if (user.role == "00") {
      res
        .status(200)
        .send({ message: "welcome " + user.name + " as merchant" });
    }
  } catch (err) {}
};

//api register
exports.register = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // simple validation
    if (!name || !username || !password || !email) {
      return res.status(403).send({ message: "Please try again" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = new User({
      name: name,
      username: username,
      password: passwordHash,
      role: role,
      email: email,
    });

    await user.save();
    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    if (err.code == 11000) {
      return res.status(403).send({ message: "Duplicate username" });
    }
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // simple validation
    if (!name || !username || !password || !email) {
      return res.status(403).send({ message: "Please try again" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = new User({
      name: name,
      username: username,
      password: passwordHash,
      role: role,
      email: email,
    });

    await user.save();
    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    if (err.code == 11000) {
      return res.status(403).send({ message: "Duplicate username" });
    }
  }
};
