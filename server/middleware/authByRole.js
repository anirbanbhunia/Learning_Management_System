import AppError from "../utils/error.util.js"

const authorizedRole = (...role) => (req,res,next) => {
    const currentUserRole = req.user.role

    if(!role.includes(currentUserRole)){
        return next(new AppError("You don't have permission to access this path",400))
    }
    next()
}

export default authorizedRole