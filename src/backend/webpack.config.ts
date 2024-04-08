import path from 'path';

import { Configuration } from 'webpack';

const serverConfig: Configuration = {
    entry: './src/backend/server.ts',
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
        filename: 'server.cjs',
        path: path.resolve(process.cwd(), 'dist'),
    },
};

export default serverConfig;
