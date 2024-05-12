const express = require('express');
const router = express.Router();
const userModel = require("../model/user.model");

router.post('/updateUser', async (req, res) => {
    const { userName, projectTitle, domain, createdAt } = req.body;

    try {
        const user = await userModel.findOneAndUpdate({username: userName}, 
            { $set: {"project_info": [
                {
                    projectTitle: projectTitle,
                    domain: domain,  
                    createdAt : createdAt
                }
            ]}}, {new: true} );
        return res.json({message: "User is updated! 🟢", user: user})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while updating the user! 🔴" });
    }
})

module.exports = router