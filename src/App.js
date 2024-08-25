
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Project from './pages/Project';
import Task from './pages/Task';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='/projekti/:id' element={<Project />} />
        <Route path='/projekti/:id/tehtava/:task_id' element={<Task />} />
      </Routes>
    </Router>
  );
}

export default App;
