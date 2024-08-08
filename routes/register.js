const express = require('express');
const router = express.Router();
const memberModel = require("../models/memberModel");

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    const newMember = new memberModel({
        username: username,
        password: password,
        approved: false
    });
    console.log(newMember.password);
    try {
        await newMember.save();
        res.status(201).json({ 
            status: 201,
            message: 'สมัครสมาชิกสำเร็จ กรุณารอการอนุมัติ' 
        });
        
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: "register fail",
        });
    }
});

module.exports = router ;