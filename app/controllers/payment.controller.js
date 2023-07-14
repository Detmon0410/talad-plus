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
    console.log("HERE");
    const { holdername, cardnumber, cvc } = req.body;
    const price = 1 * 100;
    let exp_month = 10;
    let exp_year = 25;
    let cardDetails = {
      card: {
        name: "JOHN DOE",
        number: "4242424242424242",
        expiration_month: exp_month,
        expiration_year: "20" + exp_year,
        cvc: "123",
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
  } catch (err) {
    console.log("err", err);
    res.status(403).send({ Message: err.message });
  }
};

exports.userPayment2 = async (req, res) => {
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
        console.log(charge);
        console.log(charge.amount / 100);
        // add amount to user's wallet
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
    const user = req.user;
    console.log(user);
    const money = '99'
    const payment = 'visa';
    
    const now = new Date();
    const timezoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
    const utcPlusSevenTimeInMs = now.getTime() + 7 * 60 * 60 * 1000 + timezoneOffsetInMs;
    const utcPlusSevenTime = new Date(utcPlusSevenTimeInMs);
    const hours = utcPlusSevenTime.getHours().toString().padStart(2, '0');
    const minutes = utcPlusSevenTime.getMinutes().toString().padStart(2, '0');
    const seconds = utcPlusSevenTime.getSeconds().toString().padStart(2, '0');
    const date = utcPlusSevenTime.getUTCDate();
    const month = utcPlusSevenTime.getUTCMonth() + 1;
    const year = utcPlusSevenTime.getUTCFullYear();

    const now1 = new Date();
    now1.setDate(now.getDate() + 30);
    const timezoneOffsetInMs1 = now.getTimezoneOffset() * 60 * 1000;
    const utcPlusSevenTimeInMs1 = now.getTime() + 7 * 60 * 60 * 1000 + timezoneOffsetInMs;
    const utcPlusSevenTime1 = new Date(utcPlusSevenTimeInMs);
    const hours1 = utcPlusSevenTime.getHours().toString().padStart(2, '0');;
    const minutes1 = utcPlusSevenTime.getMinutes().toString().padStart(2, '0');;
    const seconds1 = utcPlusSevenTime.getSeconds().toString().padStart(2, '0');;
    const date1 = utcPlusSevenTime.getUTCDate();
    const month1 = utcPlusSevenTime.getUTCMonth() + 1;
    const year1    = utcPlusSevenTime.getUTCFullYear();

    if (payment == "visa") {
      console.log("VISA!!!");
      const holdername = "JOHN DOE"//req.body.holdername;
      const cardnumber = "4242424242424242"//req.body.cardnumber;
      const exp_year = '24'//req.body.exp_year;
      const exp_month = '10'//req.body.exp_month;
      const cvc = '123'//req.body.cvc;

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
      
      const market = await Market.findOne({owner: user});
      console.log(user);
      market.isDonate = !market.isDonate;
      await market.save();
      return res.status(200).send({ status: market.isDonate });

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