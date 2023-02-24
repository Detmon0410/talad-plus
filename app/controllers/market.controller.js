const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Market = db.market;
const Stall = db.stall;
const StallZone = db.stallZone;

//api register
exports.register = async (req, res) => {
  try {
    const { name, phone, address, district, province, post, img } = req.body;

    // simple validation
    if ((name, !phone || !address || !district || !province || !post || !img)) {
      return res.status(403).send({ message: "Please try again" });
    }
    const myMarket = await Market.findOne({ owner: req.user });
    if (myMarket) {
      return res.status(403).send({ message: "Duplicate Market" });
    }
    if (req.user.role != "owner") {
      return res.status(403).send({ message: "you are not owner" });
    }
    const market = new Market(req.body);
    market.owner = req.user;
    await market.save();
    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    return res.status(403).send({ message: "Duplicate username" });
  }
};

exports.getAllMarket = async (req, res) => {
  try {
    const allMarket = await Market.find();
    return res.status(200).send(allMarket);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getMarketDonatePriority = async (req, res) => {
  try {
    const allMarket = await Market.find().sort({ isDonate: -1 });
    return res.status(200).send(allMarket);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getMarketNearMe = async (req, res) => {
  try {
    const allMarket = await Market.find({
      district: req.query.district,
      province: req.query.province,
    }).sort({ isDonate: -1 });
    return res.status(200).send(allMarket);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.setDonate = async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    console.log(market);
    market.isDonate = !market.isDonate;
    await market.save();
    return res.status(200).send({ status: market.isDonate });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.editMarket = async (req, res) => {
  try {
    const data = req.body;
    const market = await Market.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    await market.save();
    return res.status(200).send({ status: "Market edited" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.deteleMarket = async (req, res) => {
  try {
    await Market.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: "market delete" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
