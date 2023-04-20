require("dotenv").config({ path: "../../.env" });
const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = db.user;
const Stall = db.stall;
const Substall = db.subStall;
const Market = db.market;
const Wallet = db.wallet;
const Withdraw = db.withdraw;

exports.createWallet = async (req, res) => {
  try {
    const { bank_user, bank_number } = req.body;
    const user = await User.findById(req.user._id);

    const wallet = new Wallet({
      name: bank_user,
      bank_number: bank_number,
      owner: user,
    });

    await wallet.save();
    return res.status(200).send(wallet);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.getMyWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const wallet = await Wallet.find({ owner: user }).select("-_id");
    return res.status(200).send(wallet);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.Withdraw = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const money = await Wallet.findOne({ owner: user });
    const currentmoney = money.money;

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
    
    const withdraw = new Withdraw({
      name: money.name,
      bank_number: money.bank_number,
      money: currentmoney,
      date: `${date}/${month}/${year}`,
      time: `${hours}:${minutes}`,
      owner: user,
    });
    await withdraw.save();

    const wallet = await Wallet.updateOne(
      { owner: user },
      { $set: { money: 0 } }
    );

    return res.status(200).send("Withdraw " + currentmoney + " Bath");
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getMyWithdraw = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const wallet = await Withdraw.find({ owner: user }).select("-_id");

    return res.status(200).send(wallet);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
