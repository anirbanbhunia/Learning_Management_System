import express from "express"
import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from "../controller/payment.controller.js"
import jwtAuth from "../middleware/auth.middlewre.js"
import authorizedRole from "../middleware/authByRole.js"

const paymentRoutes = express.Router()

paymentRoutes.get('/razorpay-key',jwtAuth,getRazorpayApiKey)

paymentRoutes.post('/subscribe',jwtAuth,buySubscription) 

paymentRoutes.post("/verify",jwtAuth,verifySubscription)

paymentRoutes.post("/unsubscription",jwtAuth,cancelSubscription)

paymentRoutes.get("/",jwtAuth,authorizedRole("ADMIN"),allPayments)

export default paymentRoutes