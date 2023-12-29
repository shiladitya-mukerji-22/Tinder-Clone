import { useState } from 'react'
import Home from '../src/Pages/Home'
import Dashboard from '../src/Pages/Dashboard'
import Onboarding from '../src/Pages/Onboarding'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/onboarding" element={<Onboarding/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
