const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Market = db.market;
const Stall = db.stall;
const SubStall = db.subStall;

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

    return res.status(200).send(selectedmarket);
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
    let dateEnd = new Date(dateStart);
    let { number, payment } = req.body;

    const market = await Market.findById(req.params.marketId);
    const selectZone = await Stall.findById(req.params.stallId);

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

    if (hours.length === 1) {
      hours = "0" + hours;
    }
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }

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
      transfer_date: `${date}/${month}/${year}`,
      transfer_time: `${hours}:${minutes}`,
      price: selectZone.price,
    });

    await rentStall.save();
    return res.status(200).send({ status: "Rent Stall successful" });
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
    const substall = await SubStall.findById(req.params.id);
    const substall_status = substall.status;
    if(substall_status == 'success'){
      return res.status(200).send({status: 'Success payment can not cancel'})
    }
    await SubStall.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: "Stall canceled" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};