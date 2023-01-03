const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = db.user;
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
    res.status(200).send({ message: "welcome " + user.name });
  } catch (err) {}
};
exports.register = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    // simple validation
    if (!name || !username || !password) {
      return res.status(403).send({ message: "Please try again" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      username,
      password: passwordHash,
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
