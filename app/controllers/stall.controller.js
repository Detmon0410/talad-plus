const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Market = db.market;
const Stall = db.stall;
const SubStall = db.SubStall;

exports.getStall = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    return res.status(200).send(stall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.createSubstall = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    const { number, startDate, endDate, payment, status } = req.body;
    if (!stall) {
      return res.status(404).send({ status: "market not found" });
    }
    const substall = new SubStall({
      market: market,
      zone: zone,
      startNum: startNum,
      endNum: endNum,
      price: price,
      about: about,
    });
    await stall.save();
    return res.status(200).send({ status: "Create Stall" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
