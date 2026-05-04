import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import dotenv from 'dotenv';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import manifest from '../component.manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (mode = 'production') => {
  const devMode = mode === 'development';

  const envFile = devMode ? '.env.development' : '.env.production';
  const envPath = path.resolve(__dirname, '../../', envFile);
  const env = dotenv.config({ path: envPath }).parsed ?? {};

  const version = manifest.componentVersion;

  return {
    mode,
    devtool: devMode ? 'eval-source-map' : 'nosources-source-map',
    output: {
      path: path.resolve(__dirname, '../../dist'),
      publicPath: 'auto',
      clean: true,
      filename: devMode ? `[name]_${version}.js` : `[name]_${version}_[contenthash:8].js`,
      chunkFilename: devMode
        ? `chunks/[name]_${version}.js`
        : `chunks/[name]_${version}_[contenthash:8].js`,
      assetModuleFilename: `assets/[name]_${version}[ext]`,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, '../../src'),
        '@controls': path.resolve(__dirname, '../../src/controls'),
        '@loaders': path.resolve(__dirname, '../../src/loaders'),
        '@shared': path.resolve(__dirname, '../../src/shared'),
        '@i18n': path.resolve(__dirname, '../../src/i18n'),
        '@federation': path.resolve(__dirname, '../../src/federation'),
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.tsx?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: `images/[name]_${version}[ext]`,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.REMOTE_SYSTEM_ORIGIN': JSON.stringify(env.REMOTE_SYSTEM_ORIGIN ?? ''),
      }),
    ],
    optimization: {
      minimize: !devMode,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            mangle: true,
            format: {
              comments: false,
            },
          },
          exclude: [/\.min\.js$/gi],
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                colormin: false,
              },
            ],
          },
        }),
      ],
    },
  };
};
