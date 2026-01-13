import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLiff } from '../contexts/LiffContext';

interface FormData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    company: string;
    businessType: string;
    position: string;
    companySize: string;
}

const BUSINESS_TYPES = [
    'Technology / Software',
    'Marketing / Agency',
    'Retail / E-commerce',
    'Education',
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Other'
];

const COMPANY_SIZES = [
    '1-10 คน',
    '11-50 คน',
    '51-200 คน',
    '201-500 คน',
    '500+ คน'
];

export default function RegistrationForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, isLoggedIn, liffObject } = useLiff();

    // Redirect if no event data
    useEffect(() => {
        if (!location.state?.eventTitle) {
            navigate('/');
        }
    }, [location, navigate]);

    const eventTitle = location.state?.eventTitle || 'Event Registration';
    const eventDate = location.state?.eventDate || '';

    const [formData, setFormData] = useState<FormData>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        company: '',
        businessType: '',
        position: '',
        companySize: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Auto-fill from LIFF Context
    useEffect(() => {
        if (profile?.email) {
            setFormData(prev => ({ ...prev, email: profile.email! }));
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName) return 'กรุณาระบุชื่อ-นามสกุล';
        if (!formData.phone || formData.phone.length < 9) return 'กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง';
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'กรุณาระบุอีเมลที่ถูกต้อง';
        if (!formData.company) return 'กรุณาระบุชื่อองค์กร';
        if (!formData.businessType) return 'กรุณาเลือกประเภทธุรกิจ';
        if (!formData.position) return 'กรุณาระบุตำแหน่งงาน';
        if (!formData.companySize) return 'กรุณาเลือกขนาดองค์กร';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'การลงทะเบียนล้มเหลว');
            }

            navigate('/thank-you', {
                state: {
                    name: formData.firstName,
                    eventTitle: eventTitle,
                    eventDate: eventDate
                }
            });

        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-fixed bg-no-repeat bg-cover">
            <div className="max-w-md mx-auto relative z-10 w-full space-y-6 animate-fade-in">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-aiya-navy mb-2 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ย้อนกลับ
                </button>

                {/* Header Section */}
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-aiya-navy to-aiya-purple drop-shadow-sm px-4 leading-relaxed">
                        {eventTitle}
                    </h1>
                    {eventDate && <p className="text-gray-500 font-medium text-sm">📅 {eventDate}</p>}
                </div>

                {/* User Card (LIFF) */}
                {isLoggedIn && profile && (
                    <div className="glass-card p-4 flex items-center gap-4 mb-6 border-l-4 border-l-aiya-purple">
                        {profile.pictureUrl ? (
                            <img src={profile.pictureUrl} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-aiya-purple/20" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">👤</div>
                        )}
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Welcome</p>
                            <p className="text-aiya-navy font-bold text-lg">{profile.displayName}</p>
                        </div>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-modern">ชื่อ</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input-modern"
                                placeholder="สมชาย"
                            />
                        </div>
                        <div>
                            <label className="label-modern">นามสกุล</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input-modern"
                                placeholder="ใจดี"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label-modern">เบอร์โทรศัพท์</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-modern"
                            placeholder="0812345678"
                        />
                    </div>

                    <div>
                        <label className="label-modern">อีเมล</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-modern"
                            placeholder="somchai@example.com"
                        />
                    </div>

                    <div>
                        <label className="label-modern">ชื่อองค์กร</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="input-modern"
                            placeholder="ชื่อบริษัทของคุณ"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-modern">ประเภทธุรกิจ</label>
                            <select
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                className="input-modern appearance-none"
                            >
                                <option value="">เลือกประเภท...</option>
                                {BUSINESS_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label-modern">ขนาดองค์กร</label>
                            <select
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                className="input-modern appearance-none"
                            >
                                <option value="">เลือกขนาด...</option>
                                {COMPANY_SIZES.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label-modern">ตำแหน่งงาน</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="input-modern"
                            placeholder="Marketing Manager"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-gradient disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                ยืนยันการลงทะเบียน
                            </>
                        ) : (
                            'ลงทะเบียนเข้าร่วมงาน'
                        )}
                    </button>
                </form>

                {!liffObject?.isInClient() && (
                    <div className="p-2 bg-yellow-50 text-yellow-600 text-xs text-center rounded">
                        เปิดใน LINE เพื่อประสบการณ์ที่ดีที่สุด
                    </div>
                )}

                <p className="text-center text-gray-400 text-xs mt-8">
                    © 2024 AIYA Co., Ltd.
                </p>
            </div>
        </div>
    );
}
