import express from "express"
import { contactUs } from "../controller/miscellaneousController.js"

const miscRoutes = express.Router()

miscRoutes.post('/contact',contactUs)

export default miscRoutes