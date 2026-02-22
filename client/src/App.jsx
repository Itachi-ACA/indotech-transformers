import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import InternalLogin from './pages/InternalLogin';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import Particles from './components/Particles';
import VideoBackground from './components/VideoBackground';
import WaveCursor from './components/WaveCursor';

function AppShell() {
    const location = useLocation();
    const isReveal = location.pathname === '/reveal';

    return (
        <>
            {!isReveal && <VideoBackground />}
            {!isReveal && <Particles />}
            {!isReveal && <WaveCursor />}
            <div className={isReveal ? '' : 'relative z-10 min-h-screen'}>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/form/:type" element={<FormPage />} />
                        <Route path="/internal" element={<InternalLogin />} />
                        <Route path="/internal/dashboard" element={<AdminDashboard />} />
                        <Route path="/reveal" element={<LandingPage />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}

export default App;

