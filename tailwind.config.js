/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/**/*.blade.php",
        "./resources/**/*.jsx", "./resources/**/*.js",
        'node_modules/flowbite-react/lib/esm/**/*.js',],
    theme: {
        extend: {
            colors: {
                background: '#ffffff',
                text: '#333333',
                accent: '#6c757d',
                card: '#f9f9f9'
            },
            screens: {
                '3xl': '1600px',
                '4xl': '2000px',
                '5xl': '2200px'
            },
        },
    },
    plugins: ['flowbite/plugin'],
}

