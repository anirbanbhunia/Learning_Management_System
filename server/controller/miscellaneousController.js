import asyncHandler from "../middleware/asyncHandlerMiddleware.js";
import userModel from "../models/userModel.js";
import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendMail.util.js";

export const contactUs = asyncHandler(async (req, res, next) => {
    // Destructuring the required data from req.body
    const { name, email, message } = req.body;
  
    // Checking if values are valid
    if (!name || !email || !message) {
      return next(new AppError('Name, Email, Message are required'));
    }
  
    try {
      const subject = 'Contact Us Form';
      const textMessage = `${name} - ${email} <br /> ${message}`;
  
      // Await the send email
      await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
    } catch (error) {
      //console.log(error);
      return next(new AppError(error.message, 400));
    }
  
    res.status(200).json({
      success: true,
      message: 'Your request has been submitted successfully',
    });
  });

  export const userStats = async(req,res,next) => {
    try{
      const allUserCount = await userModel.countDocuments()

      const subscribeUserCount = await userModel.countDocuments({
        "subscription.status":"active"
      })

      res.status(200).json({
        success: true,
        message: 'All registered users count',
        allUserCount,
        subscribeUserCount
      })
    }catch(err){
      return next(new AppError(err.message, 400));
    }
  }