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
    const { bank_username, bank_number, bank_name } = req.body;
    const user = await User.findById(req.user._id);

    const wallet = new Wallet({
      name: bank_username,
      bank_number: bank_number,
      bank_name: bank_name,
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
    const hours = utcPlusSevenTime.getHours().toString().padStart(2, '0');
    const minutes = utcPlusSevenTime.getMinutes().toString().padStart(2, '0');
    const seconds = utcPlusSevenTime.getSeconds().toString().padStart(2, '0');
    const date = utcPlusSevenTime.getUTCDate();
    const month = utcPlusSevenTime.getUTCMonth() + 1;
    const year = utcPlusSevenTime.getUTCFullYear();


    const withdraw = new Withdraw({
      name: money.name,
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

exports.Topup = async (req, res) => {
  try {
    let { money, payment } = req.body;
    const user = req.user;
    const now = new Date();
    const timezoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
    const utcPlusSevenTimeInMs =
      now.getTime() + 7 * 60 * 60 * 1000 + timezoneOffsetInMs;
    const utcPlusSevenTime = new Date(utcPlusSevenTimeInMs);
    const hours = utcPlusSevenTime.getHours().toString().padStart(2, '0');
    const minutes = utcPlusSevenTime.getMinutes().toString().padStart(2, '0');
    const seconds = utcPlusSevenTime.getSeconds().toString().padStart(2, '0');
    const date = utcPlusSevenTime.getUTCDate();
    const month = utcPlusSevenTime.getUTCMonth() + 1;
    const year = utcPlusSevenTime.getUTCFullYear();

    if (hours.length === 1) {
      hours = "0" + hours;
    }
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }

    if (payment == "visa") {
      console.log("VISA!!!");
      const holdername = req.body.holdername;
      const cardnumber = req.body.cardnumber;
      const exp_year = req.body.exp_year;
      const exp_month = req.body.exp_month;
      const cvc = req.body.cvc;

      // simple validation
      if (!holdername || !cardnumber || !exp_month || !exp_year || !cvc) {
        return res.status(403).send({ message: "Something missing" });
      }
      const price = money * 100;
      let cardDetails = {
        card: {
          name: holdername,
          number: cardnumber,
          expiration_month: exp_month,
          expiration_year: "20" + exp_year,
          cvc: cvc,
        },
      };

      let omise = require("omise")({
        publicKey: process.env.OMISE_PUBLIC_KEY,
        secretKey: process.env.OMISE_PRIVATE_KEY,
      });

      const token = await omise.tokens.create(cardDetails);
      const customer = await omise.customers.create({
        email: "john.doe@example.com",
        description: "John Doe (id: 30)",
        card: token.id,
      });
      const charge = await omise.charges.create({
        amount: price,
        currency: "thb",
        customer: customer.id,
      });
      console.log(charge);
      console.log(charge.amount / 100);
      const addMoney = charge.amount / 100;
      // add amount to user's wallet
      const wallet = await Wallet.findOne({ owner: user });
      currentMoney = wallet.money;
      wallet.money = currentMoney + addMoney;
      await wallet.save();
      return res.status(200).send("Success");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};