import path from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { merge } from 'webpack-merge';
import commonConfigFactory from './webpack.common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (_ = {}, argv = {}) => {
  const mode = argv.mode || 'development';
  const commonConfig = commonConfigFactory(mode);

  return merge(commonConfig, {
    entry: {
      index: path.resolve(__dirname, '../../src/standalone/main.tsx'),
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          exclude: [
            path.resolve(__dirname, '../../public'),
            path.resolve(__dirname, '../../host-assets-source'),
          ],
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../../public/index.html'),
      }),
    ],
    devServer: {
      port: 3000,
      hot: true,
      open: true,
      static: {
        directory: path.resolve(__dirname, '../../public'),
      },
    },
  });
};
