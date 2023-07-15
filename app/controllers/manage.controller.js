const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Market = db.market;
const Stall = db.stall;
const SubStall = db.subStall;
const Wallet = db.wallet;
const Review = db.review;
const Image = db.image;

exports.getMyMarket = async (req, res) => {
  try {
    const myMarket = await Market.find({ owner: req.user });
    return res.status(200).send(myMarket);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getSelectedMarket = async (req, res) => {
  try {
    console.log(req.params.marketId);
    const selectedmarket = await Market.findById(req.params.marketId);
    const star = await Review.find({ market: req.params.marketId });
    const totalStars = star.reduce((acc, cur) => acc + cur.star, 0);
    const averageStars = totalStars / star.length;
    const response = {
      address: selectedmarket.address,
      district: selectedmarket.district,
      img: selectedmarket.img,
      isDonate: selectedmarket.isDonate,
      name: selectedmarket.name,
      owner: selectedmarket.owner,
      post: selectedmarket.post,
      province: selectedmarket.province,
      zone: selectedmarket.zone,
      _id: selectedmarket._id,
      totalStars: averageStars,
      detail: selectedmarket.detail,
    };
    console.log(response);
    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.createStall = async (req, res) => {
  try {
    const market = await Market.findById(req.params.marketId); //เรียกจาก path maret/maret:id/
    let image_b64 = "";
    if (req.files) {
      image_data = req.files.img;
      console.log(req.files.img);
      image_b64 = image_data.data.toString("base64");
    }
    const { zone, startNum, endNum, price, about, dayOpen, mtype } = req.body;
    if (!market) {
      return res.status(404).send({ status: "market not found" });
    }
    const existingStall = await Stall.findOne({ zone, startNum, endNum });
    if (existingStall) {
      return res.status(409).send({ status: "Stall already exists" });
    }

    const stall = new Stall({
      market: market,
      zone: zone,
      startNum: startNum,
      endNum: endNum,
      price: price,
      about: about,
      dayOpen: dayOpen,
      paytype: mtype,
      img: image_b64,
    });
    await stall.save();
    return res.status(200).send({ status: "Create Stall" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getStallAll = async (req, res) => {
  try {
    console.log(req.params.marketId);
    const market = await Market.findById(req.params.marketId).select([
      "name",
      "img",
    ]); //findById หาจากที่ตรงกับเงื่อนไขทั้งหมดที่ตรงกับ ID ที่ใส่ไป
    const stall = await Stall.find({ market: market }); //Find หา data ทั้งหมดที่ตรงกับเงื่อนไข // findOne เอาแค่ตัวแรกที่ตรงกับเงื่อนไข
    const marketstall = { stall: stall, market: market };
    return res.status(200).send(marketstall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getSubStall = async (req, res) => {
  try {
    const dateStart = new Date(req.query.date); //เรียกจาก payload
    let dateEnd = new Date(dateStart);
    const zone = req.params.stallId;
    const selectZone = await Stall.findById(zone); //findById หาจากที่ตรงกับเงื่อนไขทั้งหมดที่ตรงกับ ID ที่ใส่ไป
    //Find หา data ทั้งหมดที่ตรงกับเงื่อนไข // findOne เอาแค่ตัวแรกที่ตรงกับเงื่อนไข
    if (selectZone.paytype === "Month") {
      dateEnd.setDate(dateEnd.getDate() + 30);
    } else {
      dateEnd.setDate(dateEnd.getDate() + 1);
    }
    const substall = await SubStall.find({
      stall: selectZone,
      $and: [
        { dateStart: { $lte: dateEnd } },
        { dateEnd: { $gte: dateStart } },
      ],
    }).populate({
      path: "stall",
      select: "zone",
    });
    // const stallres = { stall: selectZone, substall: substall };
    return res.status(200).send(substall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.rentStall = async (req, res) => {
  try {
    const dateStart = new Date(req.body.date); //เรียกจาก payload
    const dayOfWeek = dateStart.getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[dayOfWeek];

    let dateEnd = new Date(dateStart);
    let { number, payment } = req.body;
    const market = await Market.findById(req.params.marketId);
    const selectZone = await Stall.findById(req.params.stallId);
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
    //////////////////////////////////////////////////////////////////
    const name = req.user;
    if (selectZone.paytype === "Month") {
      dateEnd.setDate(dateEnd.getDate() + 30);
    } else {
      dateEnd.setDate(dateEnd.getDate() + 1);
    }

    if (!selectZone.market.equals(market._id)) {
      return res.status(403).send({ message: "Stall doesn't match market" });
    }
    if (req.user.role !== "Merchant") {
      return res.status(403).send({ message: "Market owner can't rent stall" });
    }
    if (!(number >= selectZone.startNum && number <= selectZone.endNum)) {
      return res.status(403).send({ messenage: "stall number out of range" });
    }
    if (!(number >= selectZone.startNum && number <= selectZone.endNum)) {
      return res.status(403).send({ messenage: "stall number out of range" });
    }

    const dayOpen = selectZone.dayOpen;
    const day = dayOpen[0];
    const split = day.split(",");
    const open = split.includes(dayName);

    if (!open) {
      return res.status(403).send({ messenage: "ไม่สามารถจองได้ในวันนี้" });
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
      const price = selectZone.price * 100;
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
      const wallet = await Wallet.findOne({ owner: market.owner });
      currentMoney = wallet.money;
      wallet.money = currentMoney + addMoney;
      await wallet.save();
      const rentStall = new SubStall({
        market: market,
        market_name: market.name,
        stall: selectZone,
        zone: selectZone.zone,
        user: req.user,
        merchant: req.user.name,
        number: number,
        dateStart: dateStart,
        dateEnd: dateEnd,
        payment: payment,
        status: "success",
        name: name.name,
        transfer_date: `${date}/${month}/${year}`,
        transfer_time: `${hours}:${minutes}`,
        price: selectZone.price,
      });
      await rentStall.save();
      return res.status(200).send({ Receipt: rentStall._id });
    }
    const rentStall = new SubStall({
      market: market,
      market_name: market.name,
      stall: selectZone,
      zone: selectZone.zone,
      user: req.user,
      merchant: req.user.name,
      number: number,
      dateStart: dateStart,
      dateEnd: dateEnd,
      payment: payment,
      name: name.name,
      transfer_date: `${date}/${month}/${year}`,
      transfer_time: `${hours}:${minutes}`,
      price: selectZone.price,
    });
    await rentStall.save();
    return res.status(200).send({ Receipt: rentStall._id });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.rentedStallList = async (req, res) => {
  try {
    const date = new Date(req.query.date);
    const market = await Market.findById(req.params.marketId);
    const stall = await Stall.findById(req.params.stallId);
    const rentedStall = await SubStall.find({
      stall: stall,
      dateStart: { $lte: date },
      dateEnd: { $gte: date },
      number: { $gte: stall.startNum, $lte: stall.endNum },
    });
    return res.status(200).send({
      stall: stall,
      rentedStall: rentedStall,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.rentedStatusChange = async (req, res) => {
  try {
    const subStall = await SubStall.findById(req.params.substallId);
    const market = await Market.findById(subStall.market);
    if (!market.owner.equals(req.user._id)) {
      return res.status(403).send({ message: "You are not market owner" });
    }
    subStall.status = req.body.status;
    await subStall.save();
    return res.status(200).send({ message: "Status change successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.rentedMultipleStatusChange = async (req, res) => {
  try {
    const subStallArray = req.body;

    for (let i = 0; i < subStallArray.length; i++) {
      let substallId = subStallArray[i].id;
      const subStall = await SubStall.findById(substallId);
      console.log(subStall);
      //   const market = await Market.findById(subStall.market);
      //   if (!market.owner.equals(req.user._id)) {
      //     return res.status(403).send({ message: "You are not market owner" });
      //   }

      subStall.status = "success";
      await subStall.save();
    }
    return res.status(200).send({ message: "Status change successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.statusStallList = async (req, res) => {
  try {
    let { dateStart, dateEnd } = req.query;
    dateStart = new Date(dateStart);
    dateEnd = new Date(dateEnd);
    const stall = await Stall.findById(req.params.stallId);
    const subStallArray = await SubStall.find({
      stall: stall,
      $or: [
        { dateStart: { $lte: dateEnd }, dateEnd: { $gte: dateStart } },
        { dateStart: { $gte: dateStart, $lte: dateEnd } },
        { dateEnd: { $gte: dateStart, $lte: dateEnd } },
      ],
    });
    return res.status(200).send(subStallArray);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.userRentedStallList = async (req, res) => {
  try {
    const rentedStall = await SubStall.find({
      user: req.user,
    });
    return res.status(200).send(rentedStall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.deteleSubStall = async (req, res) => {
  try {
    await SubStall.findByIdAndDelete(req.params.marketId);
    return res.status(200).send({ status: "Stall canceled" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.uploadImages = async (req, res) => {
  try {
    console.log(req.files);
    const market = await Market.findById(req.body.market);
    const img = await Image.findOne({ market: market });
    let image_b64 = "";

    if (!img) {
      const image = new Image({
        market: market,
      });
      if (req.files) {
        image_data = req.files.img;
        image_b64 = image_data.data.toString("base64");
        image.image.push(image_b64);
        await image.save();
        return res.status(200).send({ message: "Save Image Successfully" });
      }
    }

    if (req.files) {
      image_data = req.files.img;
      image_b64 = image_data.data.toString("base64");
      img.image.push(image_b64);
      await img.save();
      return res.status(200).send({ message: "Save Image Successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};

exports.getImages = async (req, res) => {
  try {
    const market = await Market.findById(req.params.marketId);
    const img = await Image.findOne({ market: market }).populate("image");
    return res.status(200).send(img);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.deleteImages = async (req, res) => {
  try {
    const user = req.user;
    const imgb64 = req.body.img;
    const market = await Market.findOne({ owner: user });
    const img = await Image.findOne({ market: market });
    const imgArray = img.image;
    const index = imgArray.findIndex((str) => str.includes(imgb64));
    imgArray.splice(index, 1);
    await img.save();
    return res.status(200).send({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "An error occurred" });
  }
};
