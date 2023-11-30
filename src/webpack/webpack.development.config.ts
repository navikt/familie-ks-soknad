import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';

import baseConfig from './webpack.common.config';

const basePath = process.env.BASE_PATH ?? '/';
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
        publicPath: basePath,
        pathinfo: false,
    },
    devtool: 'eval-source-map',
    devServer: {
        hot: true,
        port: 3000,
        client: {
            overlay: true,
        },
        open: [basePath],
        proxy: {
            [`${basePath}modellversjon`]: `http://localhost:55554`,
            [`${basePath}api`]: `http://localhost:55554`,
            [`${basePath}dokument`]: `http://localhost:55554`,
            [`${basePath}toggles`]: `http://localhost:55554`,
            // Essentially en workaround for https://github.com/nrwl/nx/issues/3859
            '*': {
                target: 'http://localhost:3000',
                pathRewrite: () => basePath,
            },
        },
        static: {
            publicPath: basePath,
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
