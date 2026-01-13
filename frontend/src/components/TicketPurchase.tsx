import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiff } from '../contexts/LiffContext';

export default function TicketPurchase() {
    const navigate = useNavigate();
    const { profile } = useLiff();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedPackage, setSelectedPackage] = useState<'SINGLE' | 'DUO'>('SINGLE');
    const [formData, setFormData] = useState({
        name: '', // Combined name field as per design
        email: '',
        phone: '',
        referralCode: ''
    });

    const PACKAGES = {
        SINGLE: { price: 29900, fullPrice: 34900, save: 5000, label: 'SINGLE SEAT (1 ท่าน)' },
        DUO: { price: 54900, fullPrice: 69800, save: 14900, label: 'DUO PACK (2 ท่าน)' }
    };

    // Auto-fill from LIFF
    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                email: profile.email || prev.email,
                name: profile.displayName || prev.name // Use full display name
            }));
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePurchase = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        // Split name for backend
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0] || '-';
        const lastName = nameParts.slice(1).join(' ') || '-';

        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: formData.email,
                    phone: formData.phone,
                    amount: PACKAGES[selectedPackage].price,
                    packageType: selectedPackage,
                    referralCode: formData.referralCode
                })
            });

            if (response.ok) {
                alert('ส่งคำสั่งซื้อสำเร็จ! กรุณาชำระเงินในขั้นตอนถัดไป');
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
        <div className="min-h-screen bg-[#020c17] text-white font-[family-name:var(--font-line-seed)] p-4 md:p-8 flex items-center justify-center">

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                {/* Left Column: Intro & Packages */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            พร้อมสร้างอาณาจักรของคุณหรือยัง?
                        </h1>
                        <p className="text-gray-400 text-lg font-light">
                            เลือกแพ็กเกจที่ต้องการเพื่อจองสิทธิ์ในราคาพิเศษ <br className="hidden md:block" />
                            ระบบจะพาคุณไปยังหน้าชำระเงินถัดไป
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Single Package */}
                        <div
                            onClick={() => setSelectedPackage('SINGLE')}
                            className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${selectedPackage === 'SINGLE' ? 'bg-[#1e1b4b]/50 border-[#5C499D]' : 'bg-transparent border-white/10 hover:border-white/30'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm uppercase tracking-wide">SINGLE SEAT (1 ท่าน)</span>
                                <span className="bg-[#3A23B5] text-xs px-3 py-1 rounded-full font-bold">ประหยัด 5,000</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold">29,900</span>
                                <span className="text-gray-500 line-through text-sm">34,900 บาท</span>
                            </div>
                        </div>

                        {/* Duo Package */}
                        <div
                            onClick={() => setSelectedPackage('DUO')}
                            className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${selectedPackage === 'DUO' ? 'bg-[#1e1b4b]/50 border-[#5C499D]' : 'bg-transparent border-white/10 hover:border-white/30'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm uppercase tracking-wide">DUO PACK (2 ท่าน)</span>
                                <span className="bg-[#3A23B5] text-xs px-3 py-1 rounded-full font-bold">ประหยัด 14,900</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold">54,900</span>
                                <span className="text-gray-500 line-through text-sm">69,800 บาท</span>
                            </div>
                        </div>
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                        {[
                            'ชำระเงินปลอดภัย (Credit Card / PromptPay)',
                            'ยืนยันที่นั่งทันทีผ่านอีเมล',
                            'ออกใบกำกับภาษีเต็มรูปแบบได้',
                            'โบนัสพิเศษ: Cloud Credit มูลค่า $300',
                            'สิทธิ์ Consultant 1:1 รายบุคคล (เฉพาะ 10 ท่านแรก)'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500 text-xs">✓</div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: User Form */}
                <div className="bg-transparent lg:pl-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-2">ข้อมูลผู้สมัคร</h2>
                        <p className="text-gray-400 text-sm">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อรับสิทธิพิเศษ</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">ชื่อ-นามสกุล</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nattapat Lamnui"
                                    className="w-full bg-[#0b1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#5C499D] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">อีเมล</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="nattapat@aiya.ai"
                                        className="w-full bg-[#0b1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#5C499D] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">เบอร์โทรศัพท์</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0910424154"
                                        className="w-full bg-[#0b1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#5C499D] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">รหัสส่วนลด / รหัสผู้นะนำ (ถ้ามี)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" x2="20" y1="8" y2="14" /><line x1="23" x2="17" y1="11" y2="11" /></svg>
                                </div>
                                <input
                                    type="text"
                                    name="referralCode"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    placeholder="ระบุเพื่อรับโบนัสพิเศษ"
                                    className="w-full bg-[#0b1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#5C499D] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-4">
                            <div className="mt-1 text-[#5C499D]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                            </div>
                            <p className="text-sm text-gray-400">
                                รับส่วนลดทันที 1,000 บาท/ที่นั่ง เมื่อใส่รหัสผู้นะนำ
                            </p>
                        </div>

                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full py-4 mt-8 rounded-full bg-gradient-to-r from-[#3A23B5] to-[#5C499D] text-white font-bold text-lg hover:shadow-lg hover:shadow-aiya-purple/30 transition-all flex items-center justify-center gap-2 group"
                        >
                            ชำระเงิน
                            <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal (Reused) */}
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
                            <h3 className="text-xl font-bold text-white mb-1">สแกน QR เพื่อชำระเงิน</h3>
                            <p className="text-gray-400 text-sm">ยอดชำระ: ฿{PACKAGES[selectedPackage].price.toLocaleString()}</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl mb-6 mx-auto w-64 h-64 flex flex-col items-center justify-center shadow-inner">
                            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <span className="text-gray-400 text-xs">[QR Code PromptPay]</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePurchase}
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-[#2CB67D] hover:bg-[#25a06d] text-white font-bold transition-all shadow-lg shadow-green-500/20 active:scale-[0.98]"
                        >
                            {isLoading ? 'กำลังส่งคำสั่งซื้อ...' : 'ยืนยันการโอนเงิน'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
