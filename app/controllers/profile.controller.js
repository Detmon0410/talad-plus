const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const jwt = require("jsonwebtoken");

const User = db.user;
const Profile = db.profile;

exports.editProfile = async (req, res) => {
  try {
    const data = req.body;
    const user = await Profile.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    await user.save();
    return res.status(200).send({ status: "Market edited" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({status:"Please try again"});
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.user);
    const profile = await Profile.find({ merchant: user }).select('-merchant -_id -__v');

    return res.status(200).send(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { name, province, district, address, phone} = req.body;

    // simple validation
    if (!name || !province || !district || !address || !phone) {
      return res.status(403).send({ message: "Please try again" });
    }
    if (req.user.role != "merchant") {
      return res.status(403).send({ message: "you are not merchant" });
    }

    const user = await User.findById(req.params.register);
    if (!user) {
      return res.status(404).send({ status: "user not found" });
    }

    const profile = new Profile({
      merchant: user,
      name: name,
      province: province,
      district: district,
      address: address,
      phone: phone,
    });

    await profile.save();
    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
