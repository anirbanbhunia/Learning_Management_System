import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [8, 'Title must be atleast 8 characters'],
        maxLength: [59, 'Title should be lessthan 60 characters'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minLength: [8, 'Title must be atleast 8 characters'],
        maxLength: [200, 'Title should be lessthan 200 characters'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    thumbnail: {
        secure_url:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        }
    },
    lectures: [{
        title: String,
        description: String,
        lecture: {
            secure_url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }
    }],
    numbersOfLectures: {
        type: Number,
        default: 0
    },
    createdBy:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

export default mongoose.model("Course",courseSchema)