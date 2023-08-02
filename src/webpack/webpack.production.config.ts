import SentryCliPlugin from '@sentry/webpack-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';

import baseConfig from './webpack.common.config';

const prodConfig: webpack.Configuration = mergeWithRules({
    module: {
        rules: {
            test: CustomizeRule.Match,
            use: CustomizeRule.Replace,
        },
    },
})(baseConfig, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        new CssMinimizerWebpackPlugin(),
        new SentryCliPlugin({
            include: 'dist',
            org: 'nav',
            project: 'familie-ks-soknad',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            url: 'https://sentry.gc.nav.no/',
            release: process.env.SENTRY_RELEASE,
            urlPrefix: `~${process.env.BASE_PATH}`,
            errorHandler: (err, _invokeErr, compilation) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                compilation.warnings.push('Sentry CLI Plugin: ' + err.message);
            },
        }),
    ].filter(val => !!val),
    output: {
        filename: '[name].[contenthash].js',
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                compileType: 'icss',
                            },
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin(), new CssMinimizerWebpackPlugin()],
        runtimeChunk: {
            name: 'runtime',
        },
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                styles: {
                    name: 'styles',
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    performance: {
        maxEntrypointSize: 800000,
        maxAssetSize: 800000,
    },
});

export default prodConfig;
