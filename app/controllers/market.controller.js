const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Market = db.market;
const Stall = db.stall;
const User = db.user;
const Profile = db.profile;
const Review = db.review;

//api register
exports.register = async (req, res) => {
  try {
    const { name, phone, address, district, province, post } = req.body;
    let image_b64 = "";
    let image_b64_license = "";

    if (req.files) {
      image_data = req.files.img;
      image_b64 = image_data.data.toString("base64");

      image_license_data = req.files.imglicense;
      image_b64_license = image_license_data.data.toString("base64");
    }

    // simple validation
    if (!name || !phone || !address || !district || !province || !post) {
      return res.status(403).send({ message: "Please try again" });
    }
    const myMarket = await Market.findOne({ owner: req.user });
    if (myMarket) {
      return res.status(403).send({ message: "Duplicate Market" });
    }
    if (req.user.role != "Market") {
      return res.status(403).send({ message: "you are not owner" });
    }
    const market = new Market(req.body);

    market.owner = req.user;
    market.imglicense = image_b64_license;
    market.img = image_b64;
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

exports.getMarketNearMe = async (req, res) => {
  try {
    const { name, district, provice } = req.body;

    
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
    return res.status(500).send({ status: "please try again" });
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

exports.ReviewMarket = async (req, res) => {
  try {
    const user = await User.findById(req.params.review);
    const profile = await Profile.find({ merchant: user });
    const stall = await Market.findById(req.params.id);
    const { topic, description, star} = req.body;
    const review = new Review({
      profile: profile._id,
      stall: stall,
      topic: topic,
      description: description,
      star: star
    });
    
    await review.save();
    return res.status(201).send({ message: "Review successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getReview = async (req,    res) => {
  try {
    const review = await Review.find({ stall: req.params.id });
    return res.status(200).send(review);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};