const express = require("express");
const userModel = require("../model/user.model");
const router = express.Router();

router.post("/addUser", async (req, res) => {
  const { username } = req.body;

  console.log(req.body);
  try {
    if (!username) {
      return res
        .status(422)
        .json({ message: "Please fill out all the details! 🔴 ", body: req.body });
    }
    const user = await userModel.findOne({ username });
    if (user) {
      return res.status(409).json({ message: "A similar user exists! 🔴 " });
    }
    const newUser = await userModel.create({
      username
    });
    if (!newUser) {
      res.json({
        message: "Some error occurred while adding a new user! 🔴 ",
      });
    }
    res.status(201).json({ message: "User added! 🟢" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Some error occurred while adding user! 🔴 " });
  }
});


module.exports = router