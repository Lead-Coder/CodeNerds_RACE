// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/signup'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Landing from './pages/landing'
import Cover from './pages/coverletter'
import Resume from './pages/resume'
import Analysis from './pages/analysis'

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resume-builder" element={<Resume />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/coverletter" element={<Cover />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App