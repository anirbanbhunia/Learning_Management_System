import { useLocation, useNavigate } from "react-router-dom"
import Homelayout from "../../Layouts/Homelayout"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { addCourseLectures } from "../../Redux/Slices/LecturesSlice"
import { AiOutlineArrowLeft } from "react-icons/ai"

function AddLecture() {
    const {state} = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        //console.log("state in useEffect is =>", state)
        if(!state){
            navigate("/courses")
        }
    },[])

    //console.log("state is => ",state.state._id)

    const [userInput,setUserInput] = useState({
        id: state?.state?._id || "",
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: "",
    })

    function handleInput(e){
        const{name,value} = e.target
        setUserInput({
            ...userInput,
            [name]: value
        })
    }
    function handleVideo(e){
        const video = e.target.files[0]
        const source = window.URL.createObjectURL(video)
        //console.log("this is video source => ",source)

        setUserInput({
            ...userInput,
            lecture: video,
            videoSrc: source
        })
    }

    async function onFormSubmit(e){
        e.preventDefault()
        if(!userInput.lecture || !userInput.title || !userInput.description){
            toast.error("All field are required!")
            return
        }
        const res = await dispatch(addCourseLectures(userInput))
        if(res?.payload?.success){
            navigate(-1)
            setUserInput({
                id: state.state._id,
                lecture: undefined,
                title: "",
                description: "",
                videoSrc: "",
            })
        }
    }
  return (
    <Homelayout>
        <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
            <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
                <header className="flex items-center justify-center relative">
                    <button
                        className="absolute left-2 text-xl text-green-500"
                        onClick={() => navigate(-1)}
                    >
                        <AiOutlineArrowLeft/>
                    </button>
                    <h1 className="text-xl text-yellow-500 font-semibold">
                        Add new lecture
                    </h1>
                </header>
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col gap-3"
                >

                    <input 
                        type="text" 
                        name="title"
                        placeholder="Enter the title of the lecture"
                        onChange={handleInput}
                        value={userInput.title}
                        className="bg-transparent px-3 py-1 border"
                    />

                    <textarea 
                        type="text" 
                        name="description"
                        placeholder="Enter the description of the lecture"
                        onChange={handleInput}
                        value={userInput.description}
                        className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
                    />

                    {userInput.videoSrc? 
                        (
                            <video 
                                src={userInput.videoSrc}
                                controls
                                controlsList="nodownload nofullscreen"
                                disablePictureInPicture
                                muted
                                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                            >

                            </video>
                        ) 
                    : 
                        (
                            <div className="h-48 border flex items-center justify-center cursor-pointer">
                                <label className="font-semibold text-xl cursor-pointer" htmlFor="lecture">Choose your video</label>
                                <input type="file" className="hidden" id="lecture" name="lecture" onChange={handleVideo} accept="video/mp4, video/x-mp4 ,video/*"/>
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary py-1 font-semibold text-lg">
                            Add new lecture
                        </button>
                </form>
            </div>
        </div>
    </Homelayout>
  )
}

export default AddLecture