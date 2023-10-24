import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            typography(theme) {
                return {
                    DEFAULT: {
                        css: {
                            'code::before': {
                                content: 'none', // don’t generate the pseudo-element
                                // content: '""', // this is an alternative: generate pseudo element using an empty string
                            },
                            'code::after': {
                                content: 'none',
                            },
                            // 	Tailwind CSS typography plugin uses backticks around inline code. We don't want that.
                            // https://futurestud.io/tutorials/tailwind-css-remove-backticks-around-inline-code>
                            code: {
                                color: theme('colors.slate.300'),
                                backgroundColor: theme('colors.gray.900'),
                                borderRadius: theme('borderRadius.DEFAULT'),
                                paddingLeft: theme('spacing[1.5]'),
                                paddingRight: theme('spacing[1.5]'),
                                paddingTop: theme('spacing.1'),
                                paddingBottom: theme('spacing.1'),
                            },
                            // Used for accordions
                            details: {
                                color: theme('colors.slate.500'),
                                backgroundColor: theme('colors.stone.100'),
                                borderRadius: theme('borderRadius.DEFAULT'),
                                paddingLeft: theme('spacing[1.5]'),
                                paddingRight: theme('spacing[1.5]'),
                                paddingTop: theme('spacing.1'),
                                paddingBottom: theme('spacing.1'),
                            },
                        },
                    },
                };
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui(), require('@tailwindcss/typography')],
};
