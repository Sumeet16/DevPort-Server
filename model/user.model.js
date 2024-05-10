const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    profile_url: {
        type: String,
        required: true
    },
    projects_info: [
        {
            projectTitle: {
                type: String,
            },
            domain: {
                type: String,
            },
            createdAt: {
                type: String,
            }
        },
    ]
});

const userModel = new mongoose.model("USER", userSchema);

module.exports = userModel;