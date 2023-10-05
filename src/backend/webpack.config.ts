import path from 'path';

import { Configuration } from 'webpack';

const serverConfig: Configuration = {
    entry: './server.ts',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false, // Fikser at man ikke kan gjøre import uten filextension fra moduler med type: module i package.json
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            crypto: path.resolve(__dirname, 'node_modules', 'crypto-browserify'),
            stream: path.resolve(__dirname, 'node_modules', 'stream-browserify'),
            buffer: path.resolve(__dirname, 'node_modules', 'buffer'),
        },
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

export default serverConfig;
