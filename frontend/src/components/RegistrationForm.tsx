import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface FormData {
    email: string
    firstName: string
    lastName: string
    phone: string
    company: string
    businessType: string
    position: string
    companySize: string
}

interface FormErrors {
    [key: string]: string
}

const businessTypes = [
    'Technology',
    'E-commerce',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Real Estate',
    'Hospitality',
    'Retail',
    'Media & Entertainment',
    'Other',
]

const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+',
]

export default function RegistrationForm() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [formData, setFormData] = useState<FormData>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        company: '',
        businessType: '',
        position: '',
        companySize: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required'
        } else if (formData.phone.length < 9) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        if (!formData.company.trim()) {
            newErrors.company = 'Company name is required'
        }

        if (!formData.businessType) {
            newErrors.businessType = 'Please select a business type'
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required'
        }

        if (!formData.companySize) {
            newErrors.companySize = 'Please select company size'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setSubmitError('')

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed')
            }

            // Success - navigate to thank you page
            navigate('/thank-you', {
                state: {
                    firstName: formData.firstName,
                    email: formData.email
                }
            })
        } catch (error) {
            console.error('Registration error:', error)
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-140px)] py-8 px-4">
            <div className="max-w-lg mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-bold text-aiya-navy mb-3">
                        Register for the Event
                    </h1>
                    <p className="text-aiya-text-secondary text-base md:text-lg">
                        Join the <span className="font-semibold gradient-text">AI Business Bootcamp 2026</span>
                    </p>
                </div>

                {/* Registration Form Card */}
                <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="input-label">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                autoComplete="email"
                            />
                            {errors.email && <p className="input-error">{errors.email}</p>}
                        </div>

                        {/* Name Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="input-label">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    className={`input-field ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                    autoComplete="given-name"
                                />
                                {errors.firstName && <p className="input-error">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="input-label">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    className={`input-field ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                    autoComplete="family-name"
                                />
                                {errors.lastName && <p className="input-error">{errors.lastName}</p>}
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="input-label">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="081-234-5678"
                                className={`input-field ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                autoComplete="tel"
                            />
                            {errors.phone && <p className="input-error">{errors.phone}</p>}
                        </div>

                        {/* Company */}
                        <div>
                            <label htmlFor="company" className="input-label">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="AIYA Co., Ltd."
                                className={`input-field ${errors.company ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                autoComplete="organization"
                            />
                            {errors.company && <p className="input-error">{errors.company}</p>}
                        </div>

                        {/* Business Type */}
                        <div>
                            <label htmlFor="businessType" className="input-label">
                                Business Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="businessType"
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                className={`input-field appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_16px_center] bg-no-repeat pr-12 ${errors.businessType ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                            >
                                <option value="">Select business type</option>
                                {businessTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.businessType && <p className="input-error">{errors.businessType}</p>}
                        </div>

                        {/* Position */}
                        <div>
                            <label htmlFor="position" className="input-label">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="CEO, Marketing Manager, Developer..."
                                className={`input-field ${errors.position ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                autoComplete="organization-title"
                            />
                            {errors.position && <p className="input-error">{errors.position}</p>}
                        </div>

                        {/* Company Size */}
                        <div>
                            <label htmlFor="companySize" className="input-label">
                                Company Size <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="companySize"
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                className={`input-field appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_16px_center] bg-no-repeat pr-12 ${errors.companySize ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                            >
                                <option value="">Select company size</option>
                                {companySizes.map(size => (
                                    <option key={size} value={size}>{size} employees</option>
                                ))}
                            </select>
                            {errors.companySize && <p className="input-error">{errors.companySize}</p>}
                        </div>

                        {/* Submit Error */}
                        {submitError && (
                            <div className="bg-red-50 border border-red-200 rounded-aiya-sm p-4 text-red-600 text-sm">
                                {submitError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full text-lg mt-6"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                'Register Now'
                            )}
                        </button>
                    </form>
                </div>

                {/* Privacy Note */}
                <p className="text-center text-aiya-text-muted text-xs mt-6 px-4">
                    By registering, you agree to receive event-related communications from AIYA.
                    Your information will be kept confidential.
                </p>
            </div>
        </div>
    )
}
