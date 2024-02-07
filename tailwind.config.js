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
                card: '#f9f9f9',
                border:'#e9e9ec'
            },
        },
    },
    plugins: ['flowbite/plugin'],
}

