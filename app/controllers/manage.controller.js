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

exports.createStall = async (req, res) => {
  try {
    const market = await Market.findById(req.params.marketId);
    const { zone, startNum, endNum, price, about, dayOpen } = req.body;
    if (!market) {
      return res.status(404).send({ status: "market not found" });
    }
    const stall = new Stall({
      market: market,
      zone: zone,
      startNum: startNum,
      endNum: endNum,
      price: price,
      about: about,
      dayOpen: dayOpen,
    });
    await stall.save();
    return res.status(200).send({ status: "Create Stall" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getStall = async (req, res) => {
  try {
    const market = await Market.findById(req.params.marketId);
    const stall = await Stall.find({ market: market });

    return res.status(200).send(stall);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.rentStall = async (req, res) => {
  try {
    let { number, dateStart, dateEnd, payment } = req.body;
    dateStart = new Date(dateStart);
    dateEnd = new Date(dateEnd);
    const market = await Market.findById(req.params.marketId);
    const stall = await Stall.findById(req.params.stallId);
    if (!stall.market.equals(market._id)) {
      return res.status(403).send({ message: "Stall doesn't match market" });
    }
    if (req.user.role !== "user") {
      return res.status(403).send({ message: "Market owner can't rent stall" });
    }
    if (!(number >= stall.startNum && number <= stall.endNum)) {
      return res.status(403).send({ message: "stall number out of range" });
    }
    console.log(stall);
    const isDuplicate = await SubStall.findOne({
      user: req.user,
      $or: [
        { dateStart: { $lte: dateEnd }, dateEnd: { $gte: dateStart } },
        { dateStart: { $gte: dateStart, $lte: dateEnd } },
        { dateEnd: { $gte: dateStart, $lte: dateEnd } },
      ],
    });
    if (isDuplicate) {
      console.log(isDuplicate);
      return res
        .status(403)
        .send({ message: "You have rented stall at selected time" });
    }
    const isRented = await SubStall.findOne({
      number: number,
      $or: [
        { dateStart: { $lte: dateEnd }, dateEnd: { $gte: dateStart } },
        { dateStart: { $gte: dateStart, $lte: dateEnd } },
        { dateEnd: { $gte: dateStart, $lte: dateEnd } },
      ],
    });
    if (isRented) {
      console.log(isRented);
      return res.status(403).send({ message: "This stall is rented" });
    }
    const rentStall = new SubStall({
      market: market,
      stall: stall,
      user: req.user,
      number: number,
      dateStart: dateStart,
      dateEnd: dateEnd,
      payment: payment,
    });
    await rentStall.save();
    return res.status(200).send(rentStall);
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
    const subStallArray = req.body.subStallArrayId;
    const status = req.body.status;
    for (let i = 0; i < subStallArray.length; i++) {
      const subStall = await SubStall.findById(subStallArray[i]);
      const market = await Market.findById(subStall.market);
      if (!market.owner.equals(req.user._id)) {
        return res.status(403).send({ message: "You are not market owner" });
      }
      subStall.status = status;
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
