/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/**/*.blade.php",
        "./resources/**/*.jsx", "./resources/**/*.js",
        'node_modules/flowbite-react/lib/esm/**/*.js',],
    theme: {
        extend: {},
    },
    plugins: ['flowbite/plugin'],
}

