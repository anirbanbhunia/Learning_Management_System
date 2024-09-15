import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { createCourseThunk } from "../../Redux/Slices/CourseSlice"
import Homelayout from "../../Layouts/Homelayout"
import { AiOutlineArrowLeft } from "react-icons/ai"

function CreateCourse() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [userInput,setUserInput] = useState({
      title: "",
      description: "",
      category: "",
      createdBy: "",
      thumbnail: null,
      previewImage: ""
  })

  function handleImageUpload(e){
      e.preventDefault()
      const uploadImage = e.target.files[0]
      const fileReader = new FileReader()
      if(uploadImage){
        fileReader.readAsDataURL(uploadImage)
        fileReader.addEventListener("load",function(){
          setUserInput({
            ...userInput,
            thumbnail:uploadImage,
            previewImage: this.result
          })
        })
      }
  }

  function handleUserInput(e){
    const {name,value} = e.target
    setUserInput({
      ...userInput,
      [name]: value
    })
  }

  async function onFormSubmit(e){
      e.preventDefault()
      if(!userInput.title || !userInput.description || !userInput.category || !userInput.createdBy || !userInput.thumbnail){
          toast.error("All fields are mandatory")
          return
      }
      if(userInput.title.length < 8){
        toast.error("Title cannot be less than 8 characters")
        return
      }
      if(userInput.description.length < 8){
        toast.error("Description cannot be less than 8 characters")
        return
      }

      const res = await dispatch(createCourseThunk(userInput))
      if(res?.payload?.success){
        setUserInput({
            title: "",
            description: "",
            category: "",
            createdBy: "",
            thumbnail: null,
            previewImage: ""
        })
        navigate("/courses")
      }
  }

  return (
    <Homelayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form 
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
        >
            <Link className="absolute top-8 text-2xl link text-accent cursor-pointer">
              <AiOutlineArrowLeft/>
            </Link>

            <h1 className="text-center text-2xl font-bold">
              Create New Course
            </h1>

            <main className="grid grid-cols-2 gap-x-10">
                <div className="gap-y-6">
                  <div>
                    <label htmlFor="image_uploads" className="cursor-pointer">
                      {userInput.previewImage ? (
                        <img 
                          src={userInput.previewImage}
                          className="w-full m-auto h-44 border"
                        />
                      ):(
                        <div className="w-full h-44 m-auto flex items-center justify-center border">
                          <h1 className="font-bold text-lg">Upload your course thumbnail</h1>
                        </div>
                      )}
                    </label>
                    <input 
                      className="hidden" 
                      type="file"
                      name="image_uploads"
                      id="image_uploads"
                      accept=".jpg,.png,.jpeg"
                      onChange={handleImageUpload}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                      <label htmlFor="title" className="text-lg font-semibold">
                        Course title
                      </label>
                      <input
                        name="title"
                        id="title"
                        onChange={handleUserInput}
                        required
                        type="text"
                        placeholder="Enter course title"
                        className="bg-transparent px-2 py-1 border"
                        value={userInput.title}
                      />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                      <label htmlFor="createdBy" className="text-lg font-semibold">
                        Course Instructor
                      </label>
                      <input
                        name="createdBy"
                        id="createdBy"
                        onChange={handleUserInput}
                        required
                        type="text"
                        placeholder="Enter course instructor"
                        className="bg-transparent px-2 py-1 border"
                        value={userInput.createdBy}
                      />
                  </div>

                  <div className="flex flex-col gap-1">
                      <label htmlFor="category" className="text-lg font-semibold">
                        Course category
                      </label>
                      <input
                        name="category"
                        id="category"
                        onChange={handleUserInput}
                        required
                        type="text"
                        placeholder="Enter course category"
                        className="bg-transparent px-2 py-1 border"
                        value={userInput.category}
                      />
                  </div>

                  <div className="flex flex-col gap-1">
                      <label htmlFor="description" className="text-lg font-semibold">
                        Course description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        onChange={handleUserInput}
                        required
                        placeholder="Enter course description"
                        className="bg-transparent px-2 py-1 border h-24 overflow-y-scroll resize-none"
                        value={userInput.description}
                      />
                  </div>
                </div>
            </main>
            <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 py-2 rounded-sm font-semibold text-lg cursor-pointer">
              Create course
            </button>
        </form>
      </div>
    </Homelayout>
  )
}

export default CreateCourse