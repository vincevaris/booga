import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import './app.css';
import { Main } from './pages/main';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { CreatePost } from './pages/create-post/create-post';
import { Navbar } from './components/navbar';


function App() {
    return (
    <div className="app">
    <Router>
        <Navbar />
        <div className='app-content'>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/compose" element={<CreatePost />} />
            </Routes>
        </div>
    </Router>
    </div>
    );
}

export default App;
