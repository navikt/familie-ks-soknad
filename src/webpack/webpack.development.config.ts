import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';

import { BASE_PATH } from '../shared-utils/Miljø';

import baseConfig from './webpack.common.config';

const devConfig: webpack.Configuration = mergeWithRules({
    module: {
        rules: {
            test: CustomizeRule.Match,
            options: CustomizeRule.Replace,
        },
    },
})(baseConfig, {
    mode: 'development',
    entry: {
        main: ['./src/frontend/index.tsx'],
        disabled: ['./src/frontend/disabled.tsx'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'dist/'),
        publicPath: BASE_PATH,
        pathinfo: false,
    },
    devtool: 'eval-source-map',
    devServer: {
        hot: true,
        port: 3000,
        client: {
            overlay: true,
        },
        historyApiFallback: {
            index: BASE_PATH,
        },
        open: [BASE_PATH],
        proxy: [
            {
                context: [
                    `${BASE_PATH}modellversjon`,
                    `${BASE_PATH}api`,
                    `${BASE_PATH}dokument`,
                    `${BASE_PATH}toggles`,
                ],
                target: `http://localhost:55554`,
            },
        ],
        static: {
            publicPath: BASE_PATH,
        },
    },
    plugins: [new ReactRefreshWebpackPlugin()],
    optimization: {
        runtimeChunk: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: ['react-refresh/babel', '@babel/plugin-syntax-import-assertions'],
                },
            },
        ],
    },
    watchOptions: {
        ignored: ['/node_modules/**', 'src/backend/**', 'dist/**', 'build/**'],
    },
});

export default devConfig;
