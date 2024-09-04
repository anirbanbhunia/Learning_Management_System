import Homelayout from "../Layouts/Homelayout"
import aboutMainImage from "../assets/Images/aboutMainImage.png"
import CarouselSlide from "../components/CarouselSlide"
import { celebrities } from "../Constatns/CelebData.js"

function AboutUs() {
    
  return (
    <Homelayout>
        <div className="pl-20 pt-20 flex flex-col text-white">
            <div className="flex items-center gap-5 mx-10">
                <section className="w-1/2 space-y-10">
                    <h1 className="text-5xl text-yellow-500 font-semibold">
                        Affortable and quality education
                    </h1>
                    <p className="text-xl text-gray-200">
                        Our goal is to provide the affoertable and quality education to the world.
                        We are providing the platform for the aspiring teachers and students to share there skills, creativity and knowledge to each other to empower and contribute in the growth and wellness and mankind.
                    </p>
                </section>
                <div className="w-1/2">
                    <img
                        id="test1"
                        style={{
                            filter: "drop-shadow(0px 10px 10px rgb(0,0,0))"
                        }}
                        alt="about main image"
                        className="drop-shadow-2xl"
                        src={aboutMainImage}
                    />
                </div>
            </div>

            <div className="carousel w-1/2 my-16 m-auto">
                {celebrities && celebrities.map(c => (<CarouselSlide {...c} key={c.slideNumber} totalSlides={celebrities.length}/>))}
            </div>
        </div>
    </Homelayout>
  )
}

export default AboutUs