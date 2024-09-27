import path from "path"
import multer from "multer"

const upload = multer({
    dest:"./uploads",
    limits: {fileSize: 50 * 1024 * 1024}, //50 mb in size max limit
    storage: multer.diskStorage({
        destination: "./uploads",
        filename: (_req, file, cb) => {
            cb(null,file.originalname) //The first argument to cb is an error (if any), and the second is the filename.
        }
    }),
    fileFilter: (_req, file, cb) => {
       // console.log("Incoming file:", file); // Log the file object
        let ext = path.extname(file.originalname)

        if(
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png" &&
            ext !== ".mp4" 
        ){
            cb(new Error(`Unsupported file type! ${ext}`),false) 
            return
        }
        cb(null, true) //The first argument is an error (if any), and the second argument is a boolean indicating whether the file should be accepted (true) or rejected (false).
    }
})

export default upload