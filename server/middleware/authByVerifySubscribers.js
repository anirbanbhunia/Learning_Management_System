import AppError from "../utils/error.util.js"

const verifySubscribers = async(req,res,next) => {
    const subscription = req.user.subscription
    const role = req.user.role

    if(role !== 'ADMIN' && subscription.status !== 'active'){
        return next(new AppError("Please subscribe to access this course!",403))
    }

    next()
}

export default verifySubscribers