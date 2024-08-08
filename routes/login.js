const express = require('express');
const router = express.Router();
const memberModel = require('../models/memberModel'); // Assuming your member schema
const productModel = require('../models/productModel'); // Assuming your product schema
const orderModel = require('../models/orderModel'); // Assuming your order schema
const bcrypt = require('bcrypt');


router.post('/', async (req, res) => {
  
  try {
    // 1. Verify User Credentials
    const { username, password } = req.body;
    const user = await memberModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    const match = password === user.password

    if (!match) {
      return res.status(401).json({ status: 401, message: 'Incorrect password' });
    }
    // ตรวจสอบสถานะการอนุมัติของ user
    if (!user.approved) {
        return res.status(403).json({
          status: 403,
          message: 'User is not approved'
        });
      }

    const products = await productModel.find();

    const orders = await orderModel.find(); 

    res.status(200).json({
      message: 'Login successful',
      user: { username: user.username }, 
      approved: user.approved,
      products,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
