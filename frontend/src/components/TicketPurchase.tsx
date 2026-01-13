```
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiff } from '../contexts/LiffContext';

export default function TicketPurchase() {
    const navigate = useNavigate();
    const { profile } = useLiff();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const TICKET_PRICE = 2500;

    // Auto-fill from LIFF
    useEffect(() => {
        if (profile) {
            const nameParts = profile.displayName?.split(' ') || [];
            setFormData(prev => ({
                ...prev,
                email: profile.email || prev.email,
                firstName: nameParts[0] || prev.firstName,
                lastName: nameParts.slice(1).join(' ') || prev.lastName
            }));
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePurchase = async () => {
        if (!formData.firstName || !formData.email || !formData.phone) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${ apiUrl } /api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: TICKET_PRICE
                })
            });

            if (response.ok) {
                alert('ซื้อตั๋วสำเร็จ! ขอบคุณที่ร่วมงานกับเรา');
                navigate('/');
            } else {
                alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020c17] text-white font-[family-name:var(--font-line-seed)] p-4 sm:p-6 overflow-x-hidden">
             {/* Background Effects */}
             <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3A23B5]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#5C499D]/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md mx-auto relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div className="px-3 py-1 bg-gradient-to-r from-[#3A23B5] to-[#5C499D] text-white rounded-full text-[10px] font-bold shadow-lg shadow-aiya-purple/20 tracking-wide uppercase">
                        Limited Seats
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-[#0b1623]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    {/* Glow effect inside card */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none"></div>

                    <div className="space-y-6">
                        {/* Event Title */}
                        <div>
                            <p className="text-[#8B9CC8] text-sm uppercase tracking-wider font-semibold mb-2">Exclusive Workshop</p>
                            <h1 className="text-3xl font-bold leading-tight">
                                <span className="text-white">Master AI</span> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D]">Strategy</span>
                            </h1>
                        </div>

                        {/* Date Time Tags */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                <span className="text-lg">📅</span>
                                <span className="text-sm font-medium text-gray-200">21 Jan 2026</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                                <span className="text-lg">⏰</span>
                                <span className="text-sm font-medium text-gray-200">09:00 - 17:00</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed">
                            เจาะลึกกลยุทธ์ AI เพื่อธุรกิจ เิร์กช็อปจับมือทำจริง 1 วันเต็ม พร้อม Speaker ระดับประเทศ Networking สุด Exclusive
                        </p>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>

                        {/* Ticket Price Box */}
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Standard Ticket</p>
                                <p className="text-xs text-gray-500">Full Access Pass</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-white tracking-tight">฿{TICKET_PRICE.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500">รวมภาษีมูลค่าเพิ่ม</p>
                            </div>
                        </div>

                         {/* Form */}
                         <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    value={formData.firstName}
                                    placeholder="ชื่อ" 
                                    className="w-full bg-[#020c17]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] transition-all text-sm" 
                                    onChange={handleChange} 
                                />
                                <input 
                                    type="text" 
                                    name="lastName" 
                                    value={formData.lastName}
                                    placeholder="นามสกุล" 
                                    className="w-full bg-[#020c17]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] transition-all text-sm" 
                                    onChange={handleChange} 
                                />
                            </div>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email}
                                placeholder="อีเมล" 
                                className="w-full bg-[#020c17]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] transition-all text-sm" 
                                onChange={handleChange} 
                            />
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone}
                                placeholder="เบอร์โทรศัพท์" 
                                className="w-full bg-[#020c17]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7F5AF0] focus:ring-1 focus:ring-[#7F5AF0] transition-all text-sm" 
                                onChange={handleChange} 
                            />
                        </div>

                        <button 
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3A23B5] to-[#5C499D] font-bold text-lg text-white shadow-lg shadow-aiya-purple/30 hover:shadow-aiya-purple/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <span>ซื้อตั๋วทันที</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#0b1623] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative shadow-2xl">
                        <button 
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                        
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-1">ชำระเงิน</h3>
                            <p className="text-gray-400 text-sm">Scan QR to Pay</p>
                        </div>
                        
                        {/* Mock QR Code */}
                        <div className="bg-white p-4 rounded-2xl mb-6 mx-auto w-64 h-64 flex flex-col items-center justify-center shadow-inner">
                            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <span className="text-gray-400 text-xs">[QR Code PromptPay]</span>
                            </div>
                            <p className="font-bold text-black mt-3 text-sm">AIYA Co., Ltd.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm px-2">
                                <span className="text-gray-400">ยอดชำระ</span>
                                <span className="text-white font-bold text-lg">฿{TICKET_PRICE.toLocaleString()}</span>
                            </div>
                            
                            <button 
                                onClick={handlePurchase}
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl bg-[#2CB67D] hover:bg-[#25a06d] text-white font-bold transition-all shadow-lg shadow-green-500/20 active:scale-[0.98]"
                            >
                                {isLoading ? 'กำลังตรวจสอบ...' : 'แนบสลิปและยืนยัน'}
                            </button>
                            <p className="text-[10px] text-center text-gray-500">
                                ระบบจะตรวจสอบสลิปอัตโนมัติ ภายใน 1-5 นาที
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
