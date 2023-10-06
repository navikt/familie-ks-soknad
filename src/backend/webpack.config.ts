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
                    fullySpecified: false,
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

export default serverConfig;
