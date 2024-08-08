const express = require('express');
const router = express.Router();
const orderModel = require("../models/orderModel")
// Get all products
router.get("/", async (req, res, next) => {
    try {
      const order = await orderModel.find();
      res.status(200).json({ order }); 
    } catch (error) {
      next(error); 
    }
  });



module.exports = router ;