import path from 'path';

import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin.js';
import webpackModule from 'webpack';
import webpack from 'webpack';

import { unslash } from '../shared-utils/unslash';
const { DefinePlugin, ProvidePlugin } = webpackModule;

export const publicUrl = '/public';

const commonConfig: webpack.Configuration = {
    mode: 'production',
    entry: { main: './src/frontend/index.tsx', disabled: './src/frontend/disabled.tsx' },
    plugins: [
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
            PUBLIC_URL: (process.env.BASE_PATH ?? '/') + publicUrl.substr(1),
            DEKORATOREN_URL: process.env.DEKORATOREN_URL ?? 'https://www.nav.no/dekoratoren',
        }),
        new HtmlWebpackPlugin({
            template: path.join(process.cwd(), 'src/frontend/public/index.html'),
            inject: 'body',
            alwaysWriteToDisk: true,
            excludeChunks: ['disabled'],
            // Dette gjør at hvis vi navigerer direkte til /basepath/om-barna/ så henter vi fortsatt main.js fra /basepath/main.js
            publicPath: process.env.BASE_PATH ?? '/',
        }),
        new HtmlWebpackPlugin({
            template: path.join(process.cwd(), 'src/frontend/public/index.html'),
            alwaysWriteToDisk: true,
            inject: 'body',
            chunks: ['disabled'],
            filename: 'disabled.html',
            publicPath: process.env.BASE_PATH ?? '/',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/frontend/public/manifest.json', to: '.' + publicUrl },
                { from: 'src/frontend/public/favicon.ico', to: '.' + publicUrl },
                { from: 'src/frontend/public/robots.txt', to: '.' + publicUrl },
            ],
        }),
        new CaseSensitivePathsPlugin(),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH ?? '/'),
        }),
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        fallback: {
            crypto: path.resolve(process.cwd(), 'node_modules', 'crypto-browserify'),
            stream: path.resolve(process.cwd(), 'node_modules', 'stream-browserify'),
            buffer: path.resolve(process.cwd(), 'node_modules', 'buffer'),
        },
        alias: {
            'styled-components': path.resolve(process.cwd(), 'node_modules', 'styled-components'),
        },
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(process.cwd(), 'dist/'),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false, // Fikser at man ikke kan gjøre import uten filextension fra moduler med type: module i package.json
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: `${unslash(publicUrl)}/[name].[ext]`,
                },
            },
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react-app'],
                    plugins: ['@babel/plugin-syntax-import-assertions'],
                },
            },
            {
                test: /\.(css)$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'icss',
                            },
                        },
                    },
                ],
            },
        ],
    },
};

export default commonConfig;
