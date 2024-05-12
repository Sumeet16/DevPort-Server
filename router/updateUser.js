// const express = require('express');
// const router = express.Router();
// const courseModel = require("../model/course.model");

// router.post('/updateCourse', async (req, res) => {
//     const { updateCourseInfo, videos, dprice } = req.body;

//     try {
//         const courses = await courseModel.findOneAndUpdate({_id: updateCourseInfo._id}, { $set: {"title": updateCourseInfo.title, "price": updateCourseInfo.price, "discount": updateCourseInfo.discount, "dprice": dprice, "description": updateCourseInfo.description, "courseImage": updateCourseInfo.courseImage, "videos": videos}}, {new: true} );
//         return res.json({message: "Courses is updated! 🟢", course: courses})
//     } catch (error) {
//         return res
//         .status(401)
//         .json({ message: "Some error occurred while updating the course! 🔴" });
//     }
// })

// module.exports = router