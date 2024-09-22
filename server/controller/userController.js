import userModel from "../models/userModel.js"
import AppError from "../utils/error.util.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import sendEmail from "../utils/sendMail.util.js"
import crypto from "crypto"

const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    httpOnly: true,
    //secure: true //cookie is set with secure: true, the cookie will only be sent over HTTPS.
}

const register = async(req,res,next) => {
    const {fullName,email,password,role} = req.body
    //console.log(fullName,email,password)
    if(!fullName || !email || !password){
        return next(new AppError("All field are required",400)) //we send error in next middleware
    }

    const userExist = await userModel.findOne({email:email})
    if(userExist){
        return next(new AppError("User already exist",400))
    }

    const user = await userModel.create({
        fullName: fullName,
        email: email,
        password: password,
        avatar: {
            public_id: email,
            secure_url: 'https://res.cloudinary.com/demo/image/private/w_300/sample.jpg'
        }
    })

    if(!user){
        return next(new AppError("User registration failed please try again",400))
    }
    //file details come from multer and upload to cloudinary
    //console.log(req.file)
    if(role){
        user.role = role
    }
    
    if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder: "lms",
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill',
            })
            //console.log("Result is =>",result)
            if(result){
                user.avatar.public_id = result.public_id,
                user.avatar.secure_url = result.secure_url
            }
            await fs.rm(`uploads/${req.file.originalname}`)
        }catch(err){
            return next(new AppError(err))
        }
    }

    //after uploading file then save

    await user.save()
    user.password = undefined

    const token = await user.jwtTokenGenarator()
    console.log("token is => ", token)

    res.cookie("token",token,cookieOption)

    res.status(201).json({
        success: true,
        message: 'User registration successfully',
        user
    })
}

const login = async(req,res,next) => {
    try{
        const {email,password} = req.body
        if(!email || !password){
            return next(new AppError("All field are required",400))
        }

        const user = await userModel.findOne({email:email}).select("+password")

        if(!user || !await user.comparePassword(password)){
            return next(new AppError("Email or password does not match!",400))
        }

        const token = await user.jwtTokenGenarator()
        user.password = undefined

        res.cookie("token",token,cookieOption)
        //console.log("cookie is" ,token)
        res.status(200).json({
            success: true,
            message: "User login successfully",
            user
        })
    }catch(err){
        return next(new AppError(err.message,500))
    }
}

const logout = (req,res) => {
    res.cookie("token",null,{
        secure: true,
        httpOnly: true,
        maxAge: 0
    })
    res.status(200).json({
        success: true,
        message: "User logout successfully"
    })
}

const getProfile = async(req,res) => {
    try{
        const userId = req.user.id
        const user = await userModel.findById(userId)
        res.status(200).json({
            success: true,
            message: "User details",
            user
        })
    }catch(err){
        return next(new AppError("failed to fetch profile",500))
    }
}

const forgotPassword = async(req,res,next) => {
    const {email} = req.body

    if(!email){
        return next(new AppError("Email is reqiuired",400))
    }
    const user = await userModel.findOne({email:email})

    if(!user){
        return next(new AppError("Email not registered!!!",400))
    }

    const resetToken = await user.genaratePasswordResetToken()

    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`

    const subject = 'Reset password'
    const message = resetUrl

    try{
        await sendEmail(email,subject,message)
        res.status(200).json({
            success: true,
            message: `Reset password token send to ${email} successfully`
        })
    }catch(err){
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenEpiry = undefined
        await user.save()
        return next(new AppError(err.message,500))
    }
}

const resetPassword = async(req,res,next) => {
    const {resetToken} = req.params
    const {password} = req.body

    if(!password){
        return next(new AppError("Password field is required",400))
    }
    const user = await userModel.findOne({
        forgotPasswordToken: crypto.createHash("sha256").update(resetToken).digest("hex"),
        forgotPasswordTokenEpiry: {$gt: Date.now()} //if current date is smaller than forgotPasswordTokenEpiry date then the token is still valid
    })
    if(!user){
        return next(new AppError("Token is invalid or expired please try again",400))
    }
    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenEpiry = undefined

    await user.save()

    res.status(200).json({
        success: true,
        message: "Your password change successfully!"
    })
}

const changePassword = async(req,res,next) => {
    const {oldPassword,newPassword} = req.body
    if(!oldPassword || !newPassword){
        return next(new AppError("all field are required!",400))
    }
    const userId = req.user.id
    const user = await userModel.findById(userId).select("+password")

    if(!user){
        return next(new AppError("User does not exist",400))
    }
    if(!await user.comparePassword(oldPassword)){
        return next(new AppError("Invalid password",400))
    }
    user.password = newPassword
    await user.save()

    user.password = undefined

    res.status(200).json({
        success: true,
        message: "Password updated"
    })
}

const updateUser = async(req,res,next) => {
    const {fullName} = req.body
    const userId = req.user.id

    const user = await userModel.findById(userId)

    if(!user){
        return next(new AppError("User doesnot exist",400))
    }
    if(fullName){
        user.fullName = fullName
    }

    //if user update profile pic
    if(req.file){
        // first destroy previous image the the update process is same as previous 
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        // after this update the new image
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder: "lms",
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill',
            })
            console.log("Result is =>",result)
            if(result){
                user.avatar.public_id = result.public_id,
                user.avatar.secure_url = result.secure_url
            }
            await fs.rm(`uploads/${req.file.originalname}`)
        }catch(err){
            return next(new AppError(err))
        }
    }
    await user.save()
    res.status(200).json({
        success: true,
        message: "User details updated successfully!"
    })
}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
}