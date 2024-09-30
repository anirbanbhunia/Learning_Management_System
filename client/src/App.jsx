import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './Pages/Homepage'
import AboutUs from './Pages/AboutUs'
import NotFound from './Pages/NotFound'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import CourseList from './Pages/Course/CourseList'
import Contact from './Pages/Contact'
import Denied from './Pages/Denied'
import CourseDescription from './Pages/Course/CourseDescription'
import RecureAuth from './components/Auth/RecureAuth'
import CreateCourse from './Pages/Course/CreateCourse'
import UserProfile from './Pages/User/UserProfile'
import EditProfile from './Pages/User/EditProfile'
import CheckOut from './Pages/Payment/CheckOut.jsx'
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess.jsx'
import CheckoutFail from './Pages/Payment/CheckoutFail.jsx'
import DisplayLectures from './Pages/Dashboard/DisplayLectures.jsx'
import AddLecture from './Pages/Dashboard/AddLecture.jsx'
import AdminDashboard from './Pages/Dashboard/AdminDashboard.jsx'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/courses' element={<CourseList/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='/denied' element={<Denied/>}/>
        <Route path='/course/description' element={<CourseDescription/>}/>

        <Route element={<RecureAuth allowedRole={["ADMIN"]}/>}>
          <Route path='/course/create' element={<CreateCourse/>}/>
          <Route path='/course/addlecture' element={<AddLecture/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        </Route>

        <Route element={<RecureAuth allowedRole={["ADMIN","USER"]}/>}>
          <Route path='/user/profile' element={<UserProfile/>}/>
          <Route path='/user/editprofile' element={<EditProfile/>}/>
          <Route path='/checkout' element={<CheckOut/>}/>
          <Route path='/checkout/success' element={<CheckoutSuccess/>}/>
          <Route path='/checkout/fail' element={<CheckoutFail/>}/>
          <Route path='/course/displaylectures' element={<DisplayLectures/>}/>
        </Route>

        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
} 

export default App
