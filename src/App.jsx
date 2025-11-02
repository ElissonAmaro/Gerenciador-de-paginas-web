import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'


function App() {
  return (
    <div className="app">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
       
        </Routes>
      </main>
    </div>
  )
}


export default App
