import express from "express"
import { config } from "dotenv"
import cors from"cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import userRoutes from "./routes/userRoutes.js"
import errorMiddleware from "./middleware/errorMiddleware.js"
import courseRouter from "./routes/courseRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import miscRoutes from "./routes/miscellaneousRoutes.js"

config()
const app = express()


app.use(express.json())
app.use(cors({
    origin: [process.env.FRONTEND_URL], 
    credentials: true
}))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

//Morgan is a popular HTTP request logger middleware for Node.js. It logs details about incoming HTTP requests to your application, which is useful for debugging, monitoring, and understanding the traffic hitting your server.
app.use(morgan("dev"))

app.use("/ping",(req,res) => {
    res.send("Pong")
})

//routes of 3 module
//1. user routes
app.use("/api/v1/user",userRoutes)
//2. course routes
app.use("/api/v1/courses",courseRouter)
//3. payment routes
app.use("/api/v1/payments",paymentRoutes)
//4. miscellaneous routes
app.use('/api/v1', miscRoutes);

//if any other url hit then show an error
//"*": The asterisk (*) is a wildcard character that matches any route. It means that this handler will be executed for any route that hasn’t been matched by previous route handlers.
app.all("*",(req,res) => {
    res.status(404).send("OOPS!! 404 page not found")
})

//any error that reaches this point in the middleware stack will be handled by errorMiddleware.
app.use(errorMiddleware)

export default app