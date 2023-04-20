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

exports.userPayment = async (req, res) => {
  try {
    const { name, number, exp_date, cvc } = req.body;
    const substall = await Substall.findById(req.params.payment);
    const stall = await Stall.findById(substall.stall);
    const price = stall.price * 100;
    let exp_month = 10;
    let exp_year = 25;
    let cardDetails = {
      card: {
        name: name,
        number: number,
        expiration_month: exp_month,
        expiration_year: "20" + exp_year,
        cvc: cvc,
      },
    };

    let omise = require("omise")({
      publicKey: process.env.OMISE_PUBLIC_KEY,
      secretKey: process.env.OMISE_PRIVATE_KEY,
    });

    omise.tokens
      .create(cardDetails)
      .then(function (token) {
        return omise.customers.create({
          email: "john.doe@example.com",
          description: "John Doe (id: 30)",
          card: token.id,
        });
      })
      .then(function (customer) {
        return omise.charges.create({
          amount: price,
          currency: "thb",
          customer: customer.id,
        });
      })
      .then(function (charge) {
        return Wallet.updateOne(
          { owner: substall.owner },
          { $inc: { money: 10 } }
        )
          .then(() => {
            res.status(200).send("Payment success");
          })
          .catch((err) => {
            res.status(500).send("Payment fail");
          });
      })
      .catch(function (err) {
        res.status(500).send("Payment fail");
      });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.addMoney = async (req, res) => {
  try {
    const substall = await Substall.findById(req.params.payment);
    const stall = await Stall.findById(substall.stall);
    const price = stall.price;
    console.log(substall.user);
    const wallet = await Wallet.findOneAndUpdate(
      { owner: substall.user },
      { $inc: { money: stall.price } }
    );
    await wallet.save();
    return res.status(200).send({ status: "Wallet Incease" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "please try again" });
  }
};
