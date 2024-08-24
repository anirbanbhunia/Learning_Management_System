import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true,"Name is required"],
        trim: true,
        lowercase: true,
        minLength: [5,"Name must be at least 5 characters"],
        maxLength:[50,"Name should be under 50 characters"]
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        required: [true,"email is required"],
        lowercase: true,
        match: [
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
            "please fill valid email address"
        ]
    },
    password:{
        type: String,
        minLength: [8,"Password must be at least 8 characters"],
        select: false,
        required: [true,"Password is required"],
    },

    //If you were using Cloudinary to store user avatars, each uploaded image would return a public_id (which uniquely identifies the image in Cloudinary) and a secure_url (which is the direct link to access the image securely). Your schema might store these two pieces of information in the avatar object, so you can easily retrieve and display the user’s avatar when needed.

    avatar:{
        public_id:{
            type: String
        },
        secure_url:{
            type: String
        }
    },
    role:{
        type: String,
        enum:["USER","ADMIN"],
        default: "USER"
    },
    forgotPasswordToken:{
        type: String
    },
    forgotPasswordTokenEpiry:{
        type: Date
    }
},{
    timestamps: true
})

userSchema.pre("save",async function(next){
    if(!this.isModified('password')){
       return next() //next() is called to continue the save operation.
    }
    this.password = await bcrypt.hash(this.password,10)
    return next() //next() is called to continue the save operation.
})

userSchema.methods = {
        jwtTokenGenarator: async function(){
            return await jwt.sign({
                id: this._id,
                email: this.email,
                subscription: this.subscription,
                role: this.role
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRY}
        )
    },
    comparePassword: async function(passwordByUser){
        return await bcrypt.compare(passwordByUser,this.password)
    },
    genaratePasswordResetToken: async function(){
        const token = crypto.randomBytes(20).toString("hex")

        const enCriptedToken = crypto.createHash("sha256").update(token).digest("hex")

        this.forgotPasswordToken = enCriptedToken
        this.forgotPasswordTokenEpiry = Date.now() + 15 * 60 * 1000 //15min from now

        return token
    }
}

export default mongoose.model("User",userSchema) 