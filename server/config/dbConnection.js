import mongoose from "mongoose";

// Strict Query Mode: When strictQuery is set to true, Mongoose will only allow querying on fields that are defined in the schema. If you try to query using a field that isn’t defined in your schema, Mongoose will ignore that part of the query.
// For example, if your schema only has fields name and age, but you try to query using { name: "John", unknownField: "some value" }, Mongoose will ignore unknownField in strict query mode.
//Non-Strict Query Mode: When strictQuery is set to false, Mongoose will allow querying on fields that are not defined in the schema. This means that Mongoose will include the entire query object, even if some fields are not part of the schema.
mongoose.set("strictQuery",false)

const dbConnection = async() => {
    try{
        const cnn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`db connect at ${cnn.connection.host}`)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

export default dbConnection
