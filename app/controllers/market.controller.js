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
    const { name, phone, address, district, province, post, subdistrict } =
      req.body;
    let image_b64 = "";
    let image_b64_license = "";

    if (req.files) {
      image_data = req.files.img;
      image_b64 = image_data.data.toString("base64");

      image_license_data = req.files.imglicense;
      image_b64_license = image_license_data.data.toString("base64");
    }

    // simple validation
    if (
      !name ||
      !phone ||
      !address ||
      !district ||
      !province ||
      !post ||
      !subdistrict
    ) {
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
    const user = await User.findById(req.user);
    const profile = await Profile.findOne({ merchant: user });
    const market = await Market.findById(req.body.market);
    const { description, rating } = req.body;

    const now = new Date();
    const timezoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
    const utcPlusSevenTimeInMs =
      now.getTime() + 7 * 60 * 60 * 1000 + timezoneOffsetInMs;
    const utcPlusSevenTime = new Date(utcPlusSevenTimeInMs);
    const hours = utcPlusSevenTime.getHours();
    const minutes = utcPlusSevenTime.getMinutes();
    const seconds = utcPlusSevenTime.getSeconds();
    const date = utcPlusSevenTime.getUTCDate();
    const month = utcPlusSevenTime.getUTCMonth() + 1;
    const year = utcPlusSevenTime.getUTCFullYear();

    const review = new Review({
      profile: profile,
      market: market,
      description: description,
      star: rating,
      time: `${date}/${month}/${year} ${hours}:${minutes}`,
    });

    await review.save();
    return res.status(201).send({ message: "Review successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getReview = async (req, res) => {
  try {
    const market = await Market.findById(req.params.marketId);
    const reviews = await Review.find({ market: market }).populate("profile");
    return res.status(200).send(reviews);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.SearchByDistrict = async (req, res) => {
  try {
    const province = req.query.province;
    const district = req.query.district;

    if (district.length !== 0) {
      const results = await Market.find({ district: district });
      return res.status(200).send(results);
    }

    if (province.length !== 0) {
      const results = await Market.find({ province: province });
      return res.status(200).send(results);
    }

    if (province.length === 0) {
      return res.status(404).send({ error: "No documents found" });
    }

    return res.status(200).send(results);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};

exports.SearchByName = async (req, res) => {
  try {
    const { name } = req.body;
    const results = await Market.find({ name: { $regex: name } });

    if (results.length === 0) {
      return res.status(404).send({ error: "No documents found" });
    }

    return res.status(200).send(results);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};
