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

exports.numStallCalulate = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    return res.status(200).send(stall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
