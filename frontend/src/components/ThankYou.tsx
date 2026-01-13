import liff from '@line/liff';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ThankYou() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get data from previous state, fallback to defaults if accessed directly
    const name = location.state?.name || 'Guest';
    const eventTitle = location.state?.eventTitle || 'Master the AI Empire';
    const eventDate = location.state?.eventDate || 'Coming Soon';

    const handleAddToCalendar = () => {
        // Event Details
        const event = {
            title: eventTitle,
            description: 'Exclusive AI Workshop by AIYA.',
            location: 'Bangkok, Thailand (TBD)',
            // Note: In a real app we would parse eventDate to ISO format
            startTime: '20260114T090000',
            endTime: '20260114T170000',
        };

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startTime}/${event.endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

        window.open(googleCalendarUrl, '_blank');
    };

    const handleClose = () => {
        if (liff.isInClient()) {
            liff.closeWindow();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#020c17] text-white font-[family-name:var(--font-line-seed)] relative overflow-hidden flex items-center justify-center p-4">

            {/* Background Glow Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-aiya-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl animate-scale-in">

                {/* Success Icon */}
                <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-300">
                        ลงทะเบียนสำเร็จ!
                    </h2>
                    <p className="text-gray-400 text-sm">
                        ขอบคุณครับ คุณ <span className="text-white font-semibold">{name}</span>
                    </p>
                </div>

                {/* Event Ticket Card */}
                <div className="bg-black/20 rounded-2xl p-5 mb-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-aiya-purple to-aiya-navy"></div>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                            <span className="text-xl">📅</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">UPCOMING EVENT</p>
                            <h3 className="font-bold text-white leading-tight mb-1">{eventTitle}</h3>
                            <p className="text-sm text-gray-400">{eventDate}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleAddToCalendar}
                        className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-medium 
                        transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:scale-110 transition-transform">🗓️</span>
                        เพิ่มลงปฏิทิน
                    </button>

                    <button
                        onClick={handleClose}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3A23B5] to-[#5C499D] text-white font-bold text-lg 
                        shadow-lg shadow-aiya-purple/20 hover:shadow-aiya-purple/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                    >
                        ปิดหน้าต่าง
                    </button>
                </div>

                <p className="text-center text-gray-600 text-[10px] mt-8">
                    *ระบบจะส่งอีเมลยืนยันให้ท่านภายใน 5 นาที
                </p>

            </div>
        </div>
    );
}
