const express = require('express');
const router = express.Router();
const memberModel = require('../models/memberModel');

// Route สำหรับอนุมัติสมาชิก
router.put('/:id', async (req, res) => {
    const memberId = req.params.id;

    try {
        const member = await memberModel.findById(memberId);

        if (!member) {
            return res.status(404).json({ message: 'สมาชิกไม่พบ' });
        }

        member.approved = true;
        await member.save();

        res.status(200).json({ message: 'อนุมัติสมาชิกสำเร็จ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอนุมัติ' });
    }
});

module.exports = router;