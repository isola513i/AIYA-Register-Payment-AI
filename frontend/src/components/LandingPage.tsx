import { useNavigate } from 'react-router-dom';
import { useLiff } from '../contexts/LiffContext';

const EVENTS = [
    {
        id: 1,
        title: 'Master the AI Empire (Vibe Coding)',
        date: '14 มกราคม 2569',
        description: 'เรียนรู้การเขียนโค้ดร่วมกับ AI เพื่อสร้างแอปพลิเคชันระดับเทพ',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 2,
        title: 'LINE Mini App for Business',
        date: '20 กุมภาพันธ์ 2569',
        description: 'เจาะลึกการสร้าง LINE Mini App เพื่อธุรกิจและการตลาด',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 3,
        title: 'Generative AI Workshop',
        date: '15 มีนาคม 2569',
        description: 'เวิร์คช็อปเข้มข้น สร้างภาพและวิดีโอด้วย Generative AI',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000'
    }
];

export default function LandingPage() {
    const navigate = useNavigate();
    const { profile, isLoggedIn, login } = useLiff();

    const handleRegister = (event: typeof EVENTS[0]) => {
        navigate('/register', {
            state: {
                eventTitle: event.title,
                eventDate: event.date,
                eventImage: event.image
            }
        });
    };

    return (
        <div className="w-full space-y-6 animate-fade-in pb-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-aiya-navy to-aiya-purple">
                        งานสัมมนาที่น่าสนใจ
                    </h1>
                    <p className="text-gray-500 text-sm">Upcoming Events</p>
                </div>

                {/* Profile / Login */}
                <div className="flex items-center gap-3">
                    {isLoggedIn && profile ? (
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm p-1.5 pr-3 rounded-full border border-white/50 shadow-sm">
                            {profile.pictureUrl ? (
                                <img src={profile.pictureUrl} alt={profile.displayName} className="w-8 h-8 rounded-full ring-2 ring-aiya-purple/10" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-aiya-purple/10 flex items-center justify-center text-aiya-purple font-bold">
                                    {profile.displayName.charAt(0)}
                                </div>
                            )}
                            <span className="text-xs font-bold text-aiya-navy max-w-[80px] truncate hidden sm:block">
                                {profile.displayName}
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={login}
                            className="text-xs font-bold text-aiya-purple bg-aiya-purple/10 px-3 py-2 rounded-full hover:bg-aiya-purple/20 transition-colors"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Event List */}
            <div className="space-y-6">
                {EVENTS.map((event) => (
                    <div key={event.id} className="glass-card overflow-hidden hover:shadow-2xl transition-all duration-300 group">

                        {/* Image Cover */}
                        <div className="h-48 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute bottom-3 left-4 z-20">
                                <span className="bg-aiya-purple/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md">
                                    Event
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-aiya-navy mb-2 leading-tight">
                                {event.title}
                            </h3>

                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                                <svg className="w-4 h-4 text-aiya-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {event.date}
                            </div>

                            <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                                {event.description}
                            </p>

                            <button
                                onClick={() => handleRegister(event)}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-aiya-navy to-aiya-purple text-white font-bold text-sm shadow-lg shadow-aiya-purple/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
                            >
                                ลงทะเบียนทันที
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            <p className="text-center text-gray-400 text-xs mt-8">
                © 2024 AIYA Co., Ltd.
            </p>
        </div>
    );
}
