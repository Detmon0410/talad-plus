const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const jwt = require("jsonwebtoken");
const { profile } = require("../models");

const User = db.user;
const Profile = db.profile;
const Report = db.report;
const Substall = db.subStall;
const Market = db.market;
const Stall = db.stall;
const Favorite = db.favorite;

exports.editProfile = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    await user.save();
    return res.status(200).send({ status: "Market edited" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "Please try again" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const myUser = await Profile.findOne({ merchant: req.user });
    console.log(myUser);
    return res.status(200).send(myUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { name, province, district, address, phone, subdistrict } = req.body;

    // simple validation
    if (!name || !province || !district || !address || !phone) {
      return res.status(403).send({ message: "Please try again" });
    }
    if (req.user.role != "merchant") {
      return res.status(403).send({ message: "you are not merchant" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    const profile = new Profile({
      name: name,
      province: province,
      district: district,
      address: address,
      phone: phone,
      subdistrict: subdistrict,
    });
    await profile.save();

    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.reportProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const userReq = await User.findById(req.body.merchant);
    const profile = await Profile.findOne({ merchant: userReq });
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

    const report = new Report({
      profile: profile,
      reporter: user,
      description: description,
      star: rating,
      time: `${date}/${month}/${year} ${hours}:${minutes}`,
    });
    await report.save();
    return res.status(201).send({ message: "Report successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.merchantregister = async (req, res) => {
  try {
    const { name, phone, address, district, province, post } = req.body;
    console.log(req.body);
    let image_b64 = "";
    if (req.files) {
      image_data = req.files.img;
      image_b64 = image_data.data.toString("base64");
    }

    // simple validation
    if (!name || !phone || !address || !district || !province || !post) {
      return res.status(403).send({ message: "Please try again" });
    }
    const myMyprofile = await Profile.findOne({ merchant: req.user });
    console.log(myMyprofile);
    if (myMyprofile) {
      return res.status(403).send({ message: "Duplicate Name" });
    }
    if (req.user.role != "Merchant") {
      return res.status(403).send({ message: "you are not Merchant" });
    }
    const merchant = new Profile(req.body);
    merchant.merchant = req.user;
    merchant.img = image_b64;

    await merchant.save();

    console.log(merchant);
    res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    return res.status(403).send({ message: "Duplicate username" });
  }
};

exports.getSubstall = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const substall = await Substall.find({ user: user });
    return res.status(200).send(substall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getReport = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    const report = await Report.find({ profile: profile });
    return res.status(200).send(report);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getSelectedStall = async (req, res) => {
  try {
    console.log(req.params.stallId);
    const SelectedStall = await Substall.findById(req.params.stallId);

    return res.status(200).send(SelectedStall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.favoriteMarket = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const market = await Market.findById(req.body.marketId);
    const favorite = await Favorite.findOne({ profile: user });
    console.log(req.body);
    if (!favorite) {
      const fav = new Favorite({
        profile: user,
      });
      fav.market.push(market);
      await fav.save();
      return res.status(200).send({ message: "Saved" });
    }

    favorite.market.push(market);
    await favorite.save();
    return res.status(200).send({ message: "Saved" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};

exports.deletefavoriteMarket = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const market = await Market.findById(req.body.market);

    const favorite = await Favorite.findOne({ profile: user });

    favorite.market.splice(market, 1);
    await favorite.save();
    return res.status(200).send({ message: "Saved" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};

exports.getMyFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const favorite = await Favorite.findOne({ profile: user }).populate(
      "market"
    );

    if (!favorite) {
      const fav = new Favorite({
        profile: user,
      });
      await fav.save();
      return res.status(200).send(fav);
    }
    return res.status(200).send(favorite);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
