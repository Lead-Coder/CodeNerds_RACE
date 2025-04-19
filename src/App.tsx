// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/signup'
import Login from './pages/login'
import Landing from './pages/landing'
import Cover from './pages/coverletter'

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/coverletter" element={<Cover />} />
        
      </Routes>
    </Router>
    </>
  )
}

export default App