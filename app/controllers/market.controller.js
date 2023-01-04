const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Market = db.market;

//api register
exports.marketregister = async (req, res) => {
  try {
    const { market_name, market_details, market_address } = req.body;

    // simple validation
    if (!market_name || !market_details || !market_address) {
      return res.status(403).send({ message: "Please try again" });
    }

    const market = new Market({
      market_name,
      market_details,
      market_address,
    });

    await market.save();
    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    if (err.code == 11000) {
      return res.status(403).send({ message: "Duplicate username" });
    }
  }
};
