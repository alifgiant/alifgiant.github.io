/**
 * TailwindCSS Configuration
 * Design tokens extracted from design reference files
 */
module.exports = {
    content: [
        './src/**/*.{njk,html,js}',
        './contents/**/*.md'
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#8D6E63',
                'primary-dark': '#5D4037',
                'primary-hover': '#6F5236',
                'accent': '#D7CCC8',
                'surface': '#ffffff',
                'surface-alt': '#F5F5F4',
                'background-light': '#FAFAF9',
                'background-accent': '#EBE5DF',
                'text-main': '#292524',
                'text-muted': '#57534E',
            },
            fontFamily: {
                'display': ['Space Grotesk', 'sans-serif'],
                'body': ['DM Sans', 'sans-serif']
            },
            borderRadius: {
                'DEFAULT': '1rem',
                'lg': '1.5rem',
                'xl': '2.5rem',
                '2xl': '3rem',
                '3xl': '4rem',
                'full': '9999px'
            },
            backgroundImage: {
                'gradient-warm': 'linear-gradient(135deg, #FAF9F6 0%, #EBE5DF 100%)',
                'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
                'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")"
            }
        },
    },
    plugins: [],
}
