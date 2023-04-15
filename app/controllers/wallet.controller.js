require('dotenv').config({ path: '../../.env' });
const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = db.user;
const Stall = db.stall;
const Substall = db.subStall;
const Market = db.market;
const Wallet = db.wallet;

exports.createWallet = async (req, res) => {
    try {
        const { name, bank_number} = req.body;
        const user = await User.findById(req.params.create);

        const wallet = new Wallet({
            name: name,
            bank_number: bank_number,
            owner: user,
          });
    
        await wallet.save();
        return res.status(200).send(wallet);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
};

exports.getMyWallet = async (req, res) => {
  try {
    const user = await User.findById(req.params.user);
    const wallet = await Wallet.find({ owner: user }).select('-_id');

    return res.status(200).send(wallet);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.Withdraw = async (req, res) => {
    try {
      const user = await User.findById(req.params.user);
      const money = await Wallet.findOne({ owner: user });
      const currentmoney = money.money
      const wallet = await Wallet.updateOne({ owner: user }, {$set: { money: 0 } });
      
      return res.status(200).send("Withdraw "+currentmoney+" Bath");
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  };


