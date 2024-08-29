import express from "express"
import { addLectureToCourseById, createCourse, deleteLecture, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controller/course.controller.js"
import jwtAuth from "../middleware/auth.middlewre.js"
import upload from "../middleware/multer.middleware.js"
import authorizedRole from "../middleware/authByRole.js"
import verifySubscribers from "../middleware/authByVerifySubscribers.js"

const courseRouter = express.Router()

courseRouter.get("/",getAllCourses)
courseRouter.post("/",jwtAuth,authorizedRole("ADMIN"),upload.single("thumbnail"),createCourse)

courseRouter.put("/:id",jwtAuth,authorizedRole("ADMIN"),updateCourse)
courseRouter.delete("/:id",jwtAuth,authorizedRole("ADMIN"),removeCourse)
courseRouter.post("/:id",jwtAuth,authorizedRole("ADMIN"),upload.single("lecture"),addLectureToCourseById)
courseRouter.delete("/:id/lectures/:lectureId",jwtAuth,authorizedRole("ADMIN"),deleteLecture)
courseRouter.get("/:id",jwtAuth,verifySubscribers,getLecturesByCourseId) //if i logged in only i see the course details

export default courseRouter