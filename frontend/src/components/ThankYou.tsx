import { useLocation, useNavigate } from 'react-router-dom'

interface LocationState {
    firstName?: string
    email?: string
}

export default function ThankYou() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state as LocationState | null
    const firstName = state?.firstName || 'Guest'

    // Generate ICS calendar file
    const handleAddToCalendar = () => {
        // Event details - using placeholder date/time
        const eventTitle = 'AIYA AI Business Bootcamp 2026'
        const eventDescription = 'Join us for the AI Business Bootcamp 2026. Learn AI Strategy, Vibe Coding, LINE MINI App Experience Design, AI Creative Factory, and Agentic Autopilot.'
        const eventLocation = 'Online (Link will be sent via email)'

        // Placeholder date: February 15, 2026 at 9:00 AM (Bangkok time)
        const startDate = new Date('2026-02-15T09:00:00+07:00')
        const endDate = new Date('2026-02-15T17:00:00+07:00')

        // Format dates for ICS (YYYYMMDDTHHMMSSZ format in UTC)
        const formatDate = (date: Date): string => {
            return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
        }

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AIYA//Event Registration//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
DTSTAMP:${formatDate(new Date())}
UID:aiya-bootcamp-2026-${Date.now()}@aiya.ai
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}
LOCATION:${eventLocation}
STATUS:CONFIRMED
ORGANIZER;CN=AIYA:mailto:events@aiya.ai
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${eventTitle}
TRIGGER:-PT1H
END:VALARM
END:VEVENT
END:VCALENDAR`

        // Create and download the file
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'aiya-bootcamp-2026.ics'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
    }

    return (
        <div className="min-h-[calc(100vh-140px)] py-8 px-4 flex items-center justify-center">
            <div className="max-w-lg mx-auto text-center">
                {/* Success Icon */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="w-24 h-24 mx-auto bg-aiya-gradient rounded-full flex items-center justify-center shadow-aiya-lg animate-pulse-glow">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-aiya-navy mb-4">
                        Registration Successful! 🎉
                    </h1>
                    <p className="text-aiya-text-secondary text-lg mb-2">
                        Thank you, <span className="font-semibold text-aiya-navy">{firstName}</span>!
                    </p>
                    <p className="text-aiya-text-secondary mb-8">
                        We've sent a confirmation email with event details.
                        Check your inbox for more information.
                    </p>
                </div>

                {/* Event Card */}
                <div
                    className="card mb-8 animate-fade-in-up text-left"
                    style={{ animationDelay: '0.2s' }}
                >
                    <div className="bg-aiya-gradient rounded-aiya-sm p-5 mb-6">
                        <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                            <span>📅</span> Event Details
                        </h3>
                        <div className="space-y-2 text-white/90 text-sm">
                            <p><strong>Event:</strong> AI Business Bootcamp 2026</p>
                            <p><strong>Date:</strong> To be announced</p>
                            <p><strong>Format:</strong> Online Seminar</p>
                            <p><strong>Stream Link:</strong> Will be sent via email</p>
                        </div>
                    </div>

                    {/* What's Next */}
                    <h4 className="font-semibold text-aiya-navy mb-3">What's Next?</h4>
                    <ul className="space-y-3 text-aiya-text-secondary text-sm">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-aiya-purple/10 rounded-full flex items-center justify-center text-aiya-purple text-xs font-bold">1</span>
                            <span>Check your email for confirmation</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-aiya-purple/10 rounded-full flex items-center justify-center text-aiya-purple text-xs font-bold">2</span>
                            <span>Add the event to your calendar</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-aiya-purple/10 rounded-full flex items-center justify-center text-aiya-purple text-xs font-bold">3</span>
                            <span>Join us on the event day!</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div
                    className="space-y-3 animate-fade-in-up"
                    style={{ animationDelay: '0.3s' }}
                >
                    <button
                        onClick={handleAddToCalendar}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Add to Calendar
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary w-full"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Social Share */}
                <p className="text-aiya-text-muted text-sm mt-8">
                    Excited about the event? Share with your network!
                </p>
            </div>
        </div>
    )
}
