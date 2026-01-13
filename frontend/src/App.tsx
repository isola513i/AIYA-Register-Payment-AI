import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import ThankYou from './components/ThankYou';
// TicketPurchase is hidden for now

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {/* <Route path="/tickets" element={<TicketPurchase />} /> */}
            <Route path="/tickets" element={<LandingPage />} />
        </Routes>
    );
}
