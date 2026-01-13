import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import ThankYou from './components/ThankYou';

function App() {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-fixed bg-no-repeat bg-cover">
            <div className="max-w-md mx-auto relative z-10 w-full">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/thank-you" element={<ThankYou />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
