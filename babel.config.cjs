// Jest nekter å lese .babelrc-filer, så da får det bli babel.config.cjs
module.exports = {
    presets: ['@babel/preset-react', '@babel/preset-typescript', '@babel/preset-env'],
    plugins: [
        [
            'babel-plugin-styled-components',
            {
                displayName: process.env.NODE_ENV !== 'production',
            },
        ],
        '@babel/plugin-syntax-import-assertions'
    ],
};
