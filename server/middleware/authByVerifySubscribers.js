import userModel from "../models/userModel.js"
import AppError from "../utils/error.util.js"
import asyncHandler from "./asyncHandlerMiddleware.js"

const verifySubscribers = asyncHandler(async(req,res,next) => {
    const subscription = req.user.subscription
    const role = req.user.role

    const user = await userModel.findById(req.user.id)
    console.log("this is database user => ", user)

    if(user.role !== 'ADMIN' && user.subscription.status !== 'active'){
        return next(new AppError("Please subscribe to access this course!",403))
    }

    next()
}) 

export default verifySubscribers