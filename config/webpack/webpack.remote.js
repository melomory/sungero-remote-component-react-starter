import path from 'node:path';
import { fileURLToPath } from 'node:url';
import SungeroRemoteComponentMetadataPlugin from '@directum/sungero-remote-component-metadata-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import packageJson from '../../package.json' with { type: 'json' };
import manifest from '../component.manifest.js';
import commonConfigFactory from './webpack.common.js';

const { ModuleFederationPlugin } = webpack.container;
const { dependencies } = packageJson;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (_env = {}, argv = {}) => {
  const mode = argv.mode || 'production';
  const commonConfig = commonConfigFactory(mode);

  const generateMetadataPlugin = new SungeroRemoteComponentMetadataPlugin(manifest);
  const publicName = generateMetadataPlugin.getPublicName();

  return merge(commonConfig, {
    entry: {
      [publicName]: path.resolve(__dirname, '../../src/federation/public-path.ts'),
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: mode === 'development' ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      }),
      new ModuleFederationPlugin({
        name: publicName,
        filename: 'remoteEntry.js',
        exposes: {
          loaders: path.resolve(__dirname, '../../src/federation/component.loaders.ts'),
          publicPath: path.resolve(__dirname, '../../src/federation/public-path.ts'),
        },
        shared: {
          react: {
            singleton: true,
            strictVersion: true,
            requiredVersion: dependencies.react,
          },
          'react-dom': {
            singleton: true,
            strictVersion: true,
            requiredVersion: dependencies['react-dom'],
          },
          i18next: {
            singleton: true,
            eager: false,
            requiredVersion: dependencies.i18next,
          },
          'react-i18next': {
            singleton: true,
            strictVersion: true,
            requiredVersion: dependencies['react-i18next'],
          },
        },
      }),
      generateMetadataPlugin,
    ],
  });
};
