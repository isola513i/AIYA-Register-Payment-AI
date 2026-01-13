/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // AIYA Corporate Colors
                aiya: {
                    navy: '#041527',
                    'navy-light': '#0a2540',
                    'navy-dark': '#020c17',
                    purple: '#3A23B5',
                    'purple-light': '#5C499D',
                    white: '#FFFFFF',
                    gray: '#F8FAFC',
                    'gray-border': '#E2E8F0',
                    'text-muted': '#94A3B8',
                    'text-secondary': '#475569',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Kanit', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'aiya': '1.5rem',
                'aiya-sm': '0.75rem',
            },
            boxShadow: {
                'aiya': '0 4px 6px -1px rgba(4, 21, 39, 0.1), 0 2px 4px -1px rgba(4, 21, 39, 0.06)',
                'aiya-lg': '0 10px 15px -3px rgba(4, 21, 39, 0.1), 0 4px 6px -2px rgba(4, 21, 39, 0.05)',
            },
            backgroundImage: {
                'aiya-gradient': 'linear-gradient(135deg, #3A23B5 0%, #5C499D 100%)',
                'aiya-navy-gradient': 'linear-gradient(135deg, #041527 0%, #0a2540 100%)',
            },
        },
    },
    plugins: [],
}
