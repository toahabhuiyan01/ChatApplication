import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Chat from './components/Chat'
import Join from './components/Join'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<Join />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
