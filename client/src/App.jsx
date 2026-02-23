import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import InternalLogin from './pages/InternalLogin';
import AdminDashboard from './pages/AdminDashboard';
import ScrollCanvas from './components/ScrollCanvas';
import LightningCursor from './components/LightningCursor';

function App() {
    return (
        <BrowserRouter>
            <ScrollCanvas />
            <LightningCursor />
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
