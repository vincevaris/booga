import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import './app.css';
import { Home } from './pages/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { CreatePost } from './pages/create-post/create-post';
import { Navbar } from './components/navbar';
import { UserProfile } from './pages/user-profile';

function App() {
    return (
    <div className="app">
    <Router>
        <Navbar />
        <div className='main'>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/compose" element={<CreatePost />} />

                <Route path="/u/:id" element={<UserProfile />} />
            </Routes>
        </div>
    </Router>
    </div>
    );
}

export default App;
