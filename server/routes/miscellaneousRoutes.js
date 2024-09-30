import express from "express"
import { contactUs, userStats } from "../controller/miscellaneousController.js"
import jwtAuth from "../middleware/auth.middlewre.js"
import authorizedRole from "../middleware/authByRole.js"

const miscRoutes = express.Router()

miscRoutes.post('/contact',contactUs)
miscRoutes.get("/admin/stats/users",jwtAuth,authorizedRole("ADMIN"),userStats)

export default miscRoutes