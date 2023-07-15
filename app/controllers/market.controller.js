const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Market = db.market;
const Stall = db.stall;
const User = db.user;
const Profile = db.profile;
const Review = db.review;
const Image = db.image;
const Withdraw = db.withdraw;
const Donate = db.donate;

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

    market.detail = "";
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
    const allMarket = await Market.aggregate([
      { $sample: { size: 10 } }, // Adjust the size according to your requirements
    ]);

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

exports.editDetail = async (req, res) => {
  try {
    const { detail, marketid } = req.body;
    console.log(marketid);
    const market = await Market.findByIdAndUpdate(
      marketid,
      { detail },
      {
        new: true,
      }
    );

    if (!market) {
      return res.status(404).send({ error: "Market not found" });
    }

    return res.status(200).send({ status: "Market edited", market });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};
exports.editDetail = async (req, res) => {
  try {
    const { detail, marketid } = req.body;
    console.log(marketid);
    const market = await Market.findByIdAndUpdate(
      marketid,
      { detail },
      {
        new: true,
      }
    );

    if (!market) {
      return res.status(404).send({ error: "Market not found" });
    }

    return res.status(200).send({ status: "Market edited", market });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};

exports.buyAdvertisement = async (req, res) => {
  try {
    const money = "99";
    const payment = "visa";

    const now = new Date();
    const timezoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
    const utcPlusSevenTimeInMs =
      now.getTime() + 7 * 60 * 60 * 1000 + timezoneOffsetInMs;
    const utcPlusSevenTime = new Date(utcPlusSevenTimeInMs);
    const hours = utcPlusSevenTime.getHours().toString().padStart(2, "0");
    const minutes = utcPlusSevenTime.getMinutes().toString().padStart(2, "0");
    const seconds = utcPlusSevenTime.getSeconds().toString().padStart(2, "0");
    const date = utcPlusSevenTime.getUTCDate();
    const month = utcPlusSevenTime.getUTCMonth() + 1;
    const year = utcPlusSevenTime.getUTCFullYear();

    const now1 = new Date();
    now1.setDate(now.getDate() + 30);
    const timezoneOffsetInMs1 = now.getTimezoneOffset() * 60 * 1000;
    const utcPlusSevenTimeInMs1 =
      now.getTime() + 7 * 60 * 60 * 1000 + timezoneOffsetInMs;
    const utcPlusSevenTime1 = new Date(utcPlusSevenTimeInMs);
    const hours1 = utcPlusSevenTime.getHours().toString().padStart(2, "0");
    const minutes1 = utcPlusSevenTime.getMinutes().toString().padStart(2, "0");
    const seconds1 = utcPlusSevenTime.getSeconds().toString().padStart(2, "0");
    const date1 = utcPlusSevenTime.getUTCDate();
    const month1 = utcPlusSevenTime.getUTCMonth() + 1;
    const year1 = utcPlusSevenTime.getUTCFullYear();

    if (payment == "visa") {
      console.log("VISA!!!");
      const holdername = "JOHN DOE"; //req.body.holdername;
      const cardnumber = "4242424242424242"; //req.body.cardnumber;
      const exp_year = "24"; //req.body.exp_year;
      const exp_month = "10"; //req.body.exp_month;
      const cvc = "123"; //req.body.cvc;

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

      const market = await Market.findById(req.params.market);
      market.isDonate = !market.isDonate;
      await market.save();

      const user = market.owner;
      const history = new Withdraw({
        name: money.name,
        bank_number: money.bank_number,
        money: money,
        date: `${date}/${month}/${year}`,
        time: `${hours}:${minutes}`,
        status: "ค่าโปรโมทตลาด",
        owner: user,
      });
      await history.save();

      const donate = new Donate({
        market: req.params.market,
        name: market.name,
        startDate: `${date}/${month}/${year}`,
        endDate: `${date1}/${month1}/${year1}`,
        status: "Activate",
      });
      await donate.save();
      return res.status(200).send({ status: market.isDonate });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.donateStatus = async (req, res) => {
  try {
    const market = req.paraams.market;
    market.isDonate = !market.isDonate;
    await market.save();
    const donate = await Donate.findOneAndUpdate(
      { market: market },
      { status: "Deactivated" },
      {
        new: true,
      }
    );
    await donate.save();
    return res.status(200).send({ status: "Deactivated" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "please try again" });
  }
};
