import express from "express"
import { register,login,logout,getProfile, forgotPassword, resetPassword, changePassword, updateUser } from "../controller/userController.js"
import jwtAuth from "../middleware/auth.middlewre.js"
import upload from "../middleware/multer.middleware.js"

const routes = express.Router()

routes.post("/register",upload.single("avatar"),register)
routes.post("/login", login)
routes.get("/logout", logout)
routes.get("/me",jwtAuth,getProfile)
routes.post("/forgot-password",forgotPassword)
routes.post("/reset/:resetToken",resetPassword)
routes.post("/change-password",jwtAuth,changePassword)
routes.put("/updateuser",jwtAuth,upload.single("avatar"),updateUser)

export default routes