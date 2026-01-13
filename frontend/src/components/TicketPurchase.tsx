import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TicketPurchase() {
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const TICKET_PRICE = 2500;

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
            const response = await fetch(`${apiUrl}/api/orders`, {
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
        <div className="min-h-screen bg-[#020c17] text-white font-[family-name:var(--font-line-seed)] p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white flex items-center gap-2">
                        ← กลับหน้าหลัก
                    </button>
                    <div className="px-3 py-1 bg-aiya-purple/20 text-aiya-purple rounded-full text-xs font-bold border border-aiya-purple/30">
                        LIMITED SEATS
                    </div>
                </div>

                {/* Event Hero */}
                <div className="glass-card p-8 md:p-12 relative overflow-hidden rounded-[32px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-aiya-purple/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Exclusive Workshop</span>
                                <span className="block text-aiya-purple">Master AI Strategy</span>
                            </h1>
                            <div className="flex items-center gap-4 text-gray-300">
                                <span className="flex items-center gap-2">📅 21 Jan 2026</span>
                                <span className="flex items-center gap-2">⏰ 09:00 - 17:00</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                เจาะลึกกลยุทธ์การใช้งาน AI เพื่อธุรกิจ เิร์กช็อปจับมือทำจริง 1 วันเต็ม พร้อม Speaker ระดับประเทศและ Networking สุด Exclusive
                            </p>
                        </div>

                        {/* Ticket Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">Standard Ticket</h3>
                                    <p className="text-gray-400 text-sm">Full Access Pass</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-aiya-purple">฿{TICKET_PRICE.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">รวมภาษีมูลค่าเพิ่ม</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <input type="text" name="firstName" placeholder="ชื่อ" className="input-modern w-full" onChange={handleChange} />
                                <input type="text" name="lastName" placeholder="นามสกุล" className="input-modern w-full" onChange={handleChange} />
                                <input type="email" name="email" placeholder="อีเมล" className="input-modern w-full" onChange={handleChange} />
                                <input type="tel" name="phone" placeholder="เบอร์โทรศัพท์" className="input-modern w-full" onChange={handleChange} />
                            </div>

                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3A23B5] to-[#5C499D] font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-aiya-purple/20"
                            >
                                ซื้อตั๋วทันที
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#0b1623] border border-white/10 rounded-3xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h3 className="text-2xl font-bold text-center mb-6">ชำระเงิน</h3>

                        {/* Mock QR Code */}
                        <div className="bg-white p-4 rounded-xl mb-6 mx-auto w-64 h-64 flex items-center justify-center">
                            <div className="text-center text-black">
                                <div className="w-48 h-48 bg-gray-200 mx-auto mb-2">[QR Code PromtPay]</div>
                                <p className="font-bold text-sm">AIYA Co., Ltd.</p>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <p className="text-gray-400 text-sm">ยอดชำระ: <span className="text-white font-bold text-lg">฿{TICKET_PRICE.toLocaleString()}</span></p>
                            <p className="text-xs text-gray-500">กรุณาโอนเงินและกดปุ่มยืนยันด้านล่าง</p>

                            <button
                                onClick={handlePurchase}
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 font-bold transition-colors"
                            >
                                {isLoading ? 'กำลังตรวจสอบ...' : 'แนบสลิปและยืนยัน'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
