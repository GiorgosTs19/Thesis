/** @type {import('tailwindcss').Config} */
export default {
    content: ['./resources/**/*.blade.php', './resources/**/*.jsx', './resources/**/*.js', 'node_modules/flowbite-react/lib/esm/**/*.js'],
    theme: {
        extend: {
            colors: {
                background: '#ffffff',
                text: '#333333',
                accent: '#6c757d',
                card: '#f9f9f9',
                border: '#e9e9ec',
            },
            screens: {
                '3xl': '1600px',
                '4xl': '2000px',
                '5xl': '2200px',
            },
            lineClamp: {
                6: '6',
                7: '7',
                8: '8',
                9: '9',
                10: '10',
                11: '11',
                12: '12',
                13: '13',
                14: '14',
                15: '15',
            },
        },
    },
    plugins: ['flowbite/plugin'],
};
