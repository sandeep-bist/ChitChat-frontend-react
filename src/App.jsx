import { useState } from 'react'
import './App.css'
import LoginSignup from './components/LoginSignUp/LoginSignup'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Homepage from './components/Homepage'
import DashBoard from './components/DashBoard'
import ChatArea from './components/chatting/ChatArea'
// import Sidebar from './components/Sidebar'


function App() {

  return (
    // <>
    //     <div className="chat-container">
    //             <Sidebar/>
    //             <ChatArea/>
    //     </div>
    // </>
    <BrowserRouter>
          {/* <Homepage/> */}

          <Routes>
              <Route path='/' element={<LoginSignup/>} > </Route>
              <Route path='/login' element={<LoginSignup/>} > </Route>
              <Route path='/home' element={<DashBoard/>}> </Route>
              <Route path='/chat' element={<ChatArea/>}> </Route>

          </Routes>
  </BrowserRouter>
  )
}

export default App
