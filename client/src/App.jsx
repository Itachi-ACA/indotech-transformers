import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import InternalLogin from './pages/InternalLogin';
import AdminDashboard from './pages/AdminDashboard';
import Particles from './components/Particles';
import VideoBackground from './components/VideoBackground';

function App() {
    return (
        <BrowserRouter>
            <VideoBackground />
            <Particles />
            <div className="relative z-10 min-h-screen">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/form/:type" element={<FormPage />} />
                        <Route path="/internal" element={<InternalLogin />} />
                        <Route path="/internal/dashboard" element={<AdminDashboard />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </BrowserRouter>
    );
}

export default App;
