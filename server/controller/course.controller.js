import courseModel from "../models/course.model.js"
import AppError from "../utils/error.util.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"

const getAllCourses = async(req,res,next) => {
    try{
        const courses = await courseModel.find({}).select('-lectures') // find all the courses without lectures

        res.status(201).json({
            success: true,
            message: 'All courses',
            courses
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}

const getLecturesByCourseId = async(req,res,next) => {
    try{
        const {id} = req.params

        const course = await courseModel.findById(id)

        if(!course){
            return next(new AppError("Course not found",400))
        }

        res.status(201).json({
            success: true,
            message: 'course lecture fetched successfully',
            lectures: course.lectures
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}

const createCourse = async(req,res,next) => {
    const {title,description,category,createdBy} = req.body

    if(!title || !description || !category || !createdBy){
        return next(new AppError("All field are required",400))
    }

    const course = await courseModel.create({
        title: title,
        description: description,
        category: category,
        createdBy: createdBy,
        thumbnail: {
            secure_url: 'dummy',
            public_id:  'dummy'
        },
    })

    if(!course){
        return next(new AppError("Course could not created!!! please try again",500))
    }

    if(req.file){
        try{
            const result =await cloudinary.v2.uploader.upload(req.file.path,{
                folder: "lms"
            })
            if(result){
                course.thumbnail.secure_url = result.secure_url
                course.thumbnail.public_id = result.public_id
            }
        }catch(err){
            return next(new AppError(e.message,400))
        }finally{
            await fs.rm(`./uploads/${req.file.originalname}`)
        }
    }
    await course.save()
    res.status(201).json({
        success: true,
        message: "Course created successfully",
        course
    })
}

const updateCourse = async(req,res,next) => {
    try{
        const {id} = req.params

        const course = await courseModel.findByIdAndUpdate(
            id,
            {
                $set: req.body      //Using $set ensures that only the fields in req.body are updated, leaving all other fields unchanged.
            },
            {
                runValidators: true //runValidators: true tells Mongoose to apply the schema’s validation rules to the fields being updated.
            }
        )

        if(!course){
            return next(new AppError("Course with given id doesnot exist!!!",500))
        }

        res.status(201).json({
            success: true,
            message: "Course updated successfully",
            course
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}
const removeCourse = async(req,res,next) => {
    try{
        const {id} = req.params

        const course = await courseModel.findById(id)

        if(!course){
            return next(new AppError("Course with given id doesnot exist!!!",500))
        }

        await courseModel.findByIdAndDelete(id)

        res.status(201).json({
            success: true,
            message: "Course deleted successfully"
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}

const addLectureToCourseById = async(req,res,next) => {
    try{
        const {title,description} = req.body
        const {id} = req.params

        if(!title || !description){
            return next(new AppError("All field are required",400))
        }

        const course = await courseModel.findById(id)

        if(!course){
            return next(new AppError("Course with given id doesnot exist!!!",500))
        }

        const lectureData = {
            title: title,
            description: description,
            lecture: {}
        }

        if(req.file){
            try{
                const result =await cloudinary.v2.uploader.upload(req.file.path,{
                    folder: "lms",
                    resource_type: "video"
                })

                if(result){
                    lectureData.lecture.public_id = result.public_id
                    lectureData.lecture.secure_url = result.secure_url
                }
            }catch(err){
                return next(new AppError(err.message,400))
            }finally{
                await fs.rm(`./uploads/${req.file.originalname}`)
            }
        }

        course.lectures.push(lectureData)
        course.numbersOfLectures = course.lectures.length

        await course.save()

        res.status(201).json({
            success: true,
            message: "Lecture successfully added to the course",
            course
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}

const deleteLecture = async(req,res,next) => {
    //console.log("Request Params:", req.params);
    try{
        const {id,lectureId} = req.params

        const course = await courseModel.findById(id)

        if(!course){
            return next(new AppError("Course with given id doesnot exist!!!",500))
        }

       const updateLectures = course.lectures.filter((lec) => lec._id.toString() !== lectureId)

       if(updateLectures.length === course.lectures.length){
            return next(new AppError("Lecture with the given ID does not exist!", 500))
       }

       course.lectures = updateLectures
       course.numbersOfLectures = course.lectures.length

       await course.save()

        res.status(200).json({
            success: true,
            message: "Lecture deleted successfully"
        })
    }catch(err){
        return next(new AppError(err.message,400))
    }
}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deleteLecture
}