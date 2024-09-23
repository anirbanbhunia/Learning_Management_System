import { razorpay } from "../index.js"
import asyncHandler from "../middleware/asyncHandlerMiddleware.js"
import paymentModel from "../models/payment.model.js"
import userModel from "../models/userModel.js"
import AppError from "../utils/error.util.js"
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config()

// console.log("this is plan iddddd",process.env.RAZORPAY_PLAN_ID)
// console.log("this is key...",process.env.RAZORPAY_KEY_ID)
// console.log("this is secret...",process.env.RAZORPAY_SECRET)

const getRazorpayApiKey = async(req,res,next) => {
    try{ 
        res.status(200).json({
            success: true,
            message: "Razorpay api key",
            key: process.env.RAZORPAY_KEY_ID
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}

const buySubscription = async(req,res,next) => {
    try{
        const {id} = req.user 
        const user = await userModel.findById(id)

        if(!user){
            return next(new AppError('Unauthorized, please login',400))
        }

        if(user.role === "ADMIN"){
            return next(new AppError("Admin cannot purchase a subscription",400))
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 12, // 12 means it will charge every month for a 1-year sub.
        })

        user.subscription.id = subscription.id
        user.subscription.status = subscription.status

        await user.save()

        res.status(200).json({
            success: true,
            message: "Subscribed successfully",
            subscription_id: subscription.id
        })
    }catch(err){
        console.error("Subscription Error: ", err); 
        return next(new AppError(err.message,400))
    }
}

const verifySubscription = async(req,res,next) => { 
    try{
        const {id} = req.user
        const {razorpay_payment_id, razorpay_signature, razorpay_subscription_id} = req.body

        const user = await userModel.findById(id)

        if(!user){
            return next(new AppError('Unauthorized, please login'))
        }

        const subscriptionId = user.subscription.id

        const genaratedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest("hex")

        if(genaratedSignature !== razorpay_signature){
            return next(new AppError("Payment not verified, please try again",500))
        }

        await paymentModel.create({
            razorpay_payment_id: razorpay_payment_id,
            razorpay_subscription_id: razorpay_subscription_id,
            razorpay_signature: razorpay_signature
        })

        user.subscription.status = "active"
        const e = await user.save()

        res.status(200).json({
            success: true,
            message: "Payment verified successfully!",
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}

const cancelSubscription = asyncHandler(async(req,res,next) => {
    try{
     const {id} = req.user
 
     const user = await userModel.findById(id)
 
     if(!user){
         return next(new AppError('Unauthorized, please login'))
     }
 
     if(user.role === "ADMIN"){
         return next(new AppError("Admin cannot cancel a subscription",400))
     }
 
     const subscriptionId = user.subscription.id
 
     const subscription = await razorpay.subscriptions.cancel(
         subscriptionId
     )
 
     user.subscription.status = subscription.status
 
    await user.save()
    // console.log("cancel sub data => ",e)
     return res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully"
     })
    }catch(err){
         return next(new AppError(err.message,400))
    }
 })

const allPayments = asyncHandler(async(req,res,next) => { 
    try{
        const {count,skip} = req.query

        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10,
            skip: skip || 0
        })

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];

          const finalMonths = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
          };

          const monthlyWisePayments = subscriptions.items.map((payment) => {
            const montsInNumbers = new Date(payment.start_at * 1000)
            return monthNames[montsInNumbers.getMonth()]
          })

          monthlyWisePayments.map((month) => {
            Object.keys(finalMonths).forEach((objMonth) => {
                if(objMonth === month){
                    finalMonths[month] += 1
                }
            })
          }) 

        const monthlySalesRecord = [];

        Object.keys(finalMonths).forEach((month) => {
            monthlySalesRecord.push(finalMonths[month])
        })

        res.status(200).json({
            success: true,
            message: "All payments",
            subscriptions,
            finalMonths,
            monthlySalesRecord
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
})

export {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments
}