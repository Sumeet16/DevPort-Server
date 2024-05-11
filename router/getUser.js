const express = require('express');
const router = express.Router();
const userModel = require("../model/user.model");

router.post('/getUser', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await userModel.findOne({ username: username });
        return res.json({ message: "A user is sent! 🟢", user: user })
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Some error occurred while fetching users! 🔴" });
    }
})

module.exports = router