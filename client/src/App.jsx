import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './Pages/Homepage'
import AboutUs from './Pages/AboutUs'
import NotFound from './Pages/NotFound'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
} 

export default App
