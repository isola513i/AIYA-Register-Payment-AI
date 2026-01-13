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
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-fixed bg-no-repeat bg-cover">
            <div className="max-w-md mx-auto relative z-10 w-full space-y-6 animate-fade-in text-center pt-8">
                <div className="glass-card p-8 md:p-12 border-t-8 border-t-green-400 relative overflow-hidden">

                    {/* Confetti Decoration (CSS only simplistic) */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="100" height="100" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 opacity-10">
                        <svg width="80" height="80" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>

                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="text-4xl">🎉</span>
                    </div>

                    <h2 className="text-3xl font-bold text-aiya-navy mb-2">ลงทะเบียนสำเร็จ!</h2>
                    <p className="text-gray-500 mb-6">ขอบคุณครับ คุณ <span className="text-aiya-purple font-bold">{name}</span></p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
                        <h3 className="font-bold text-aiya-navy mb-2 flex items-center gap-2">
                            📅 นัดหมายงาน
                        </h3>
                        <p className="text-sm text-gray-600 font-bold">{eventTitle}</p>
                        <p className="text-sm text-gray-600">{eventDate}</p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleAddToCalendar}
                            className="w-full py-3 px-6 rounded-xl bg-white border border-gray-200 text-aiya-navy font-bold 
                         shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>📅</span> เพิ่มลงปฏิทิน
                        </button>

                        <button
                            onClick={handleClose}
                            className="btn-gradient w-full"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>

                </div>

                <p className="text-gray-400 text-xs text-center">
                    ระบบจะส่งอีเมลยืนยันการลงทะเบียนให้ท่านภายใน 5 นาที
                </p>

            </div>
        </div>
    );
    );
}
