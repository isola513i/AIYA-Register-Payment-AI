import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm'
import ThankYou from './components/ThankYou'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-aiya-gray">
                {/* Header */}
                <header className="bg-aiya-navy-gradient sticky top-0 z-50 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
                        <a href="/" className="text-white font-bold text-2xl tracking-tight">
                            AIYA
                        </a>
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    <Routes>
                        <Route path="/" element={<RegistrationForm />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="bg-aiya-navy text-aiya-text-muted py-8 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-sm">
                            © 2026 AIYA. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    )
}

export default App
