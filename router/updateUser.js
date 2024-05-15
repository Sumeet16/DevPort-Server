const express = require('express');
const router = express.Router();
const userModel = require("../model/user.model");

router.post('/updateUser', async (req, res) => {
    const { userName, projectTitle, domain } = req.body;

    const date = new Date();
    try {
        const user = await userModel.findOneAndUpdate({username: userName}, 
            { $push: {"projects_info": [
                {
                    "projectTitle": projectTitle,
                    "domain": domain,  
                    "createdAt" : date
                }
            ]}});
        return res.json({message: "User is updated! 🟢", user: user})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while updating the user! 🔴" });
    }
})

module.exports = router