import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js',
            publicPath: '/',
            clean: true,
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction,
                        },
                    },
                }),
                new CssMinimizerPlugin(),
                ...(isProduction
                    ? [
                          new ImageMinimizerPlugin({
                              minimizer: {
                                  implementation:
                                      ImageMinimizerPlugin.imageminMinify,
                                  options: {
                                      plugins: [
                                          [
                                              'imagemin-mozjpeg',
                                              {
                                                  quality: 80,
                                                  progressive: true,
                                              },
                                          ],
                                          [
                                              'imagemin-pngquant',
                                              { quality: [0.6, 0.8] },
                                          ],
                                          [
                                              'imagemin-gifsicle',
                                              { optimizationLevel: 3 },
                                          ],
                                          [
                                              'imagemin-svgo',
                                              {
                                                  plugins: [
                                                      {
                                                          name: 'preset-default',
                                                          params: {
                                                              overrides: {
                                                                  removeViewBox: false,
                                                              },
                                                          },
                                                      },
                                                  ],
                                              },
                                          ],
                                      ],
                                  },
                              },
                          }),
                      ]
                    : []),
            ],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                '@babel/preset-typescript',
                            ],
                        },
                    },
                },
                {
                    test: /\.module\.css$/,
                    use: [
                        isProduction
                            ? MiniCssExtractPlugin.loader
                            : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: isProduction
                                        ? '[hash:base64:5]'
                                        : '[folder]__[name]__[local]',
                                },
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: [
                        isProduction
                            ? MiniCssExtractPlugin.loader
                            : 'style-loader',
                        'css-loader',
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|webp)$/i,
                    type: 'asset',
                    generator: {
                        filename: 'images/[name].[hash][ext]',
                    },
                    parser: {
                        dataUrlCondition: {
                            maxSize: isProduction ? 4 * 1024 : 8 * 1024,
                        },
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[hash][ext]',
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                minify: isProduction
                    ? {
                          removeComments: true,
                          collapseWhitespace: true,
                          removeRedundantAttributes: true,
                          useShortDoctype: true,
                          removeEmptyAttributes: true,
                          removeStyleLinkTypeAttributes: true,
                          keepClosingSlash: true,
                          minifyJS: true,
                          minifyCSS: true,
                          minifyURLs: true,
                      }
                    : false,
            }),
            ...(isProduction
                ? [
                      new MiniCssExtractPlugin({
                          filename: 'css/[name].[contenthash].css',
                          chunkFilename: 'css/[id].[contenthash].css',
                      }),
                      new CopyWebpackPlugin({
                          patterns: [
                              {
                                  from: 'public/images',
                                  to: 'images',
                                  noErrorOnMissing: true,
                              },
                          ],
                      }),
                      new CompressionPlugin({
                          algorithm: 'gzip',
                          test: /\.(js|css|html|svg)$/,
                          threshold: 8192,
                          minRatio: 0.8,
                      }),
                  ]
                : []),
        ],
        devServer: {
            static: [
                {
                    directory: path.join(__dirname, 'dist'),
                },
                {
                    directory: path.join(__dirname, 'public'),
                },
            ],
            port: 3000,
            hot: true,
            historyApiFallback: true,
            allowedHosts: [
                'localhost',
                '.loca.lt',
                '.ngrok.io',
                '.ngrok-free.app',
            ],
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://localhost:5001',
                    secure: false,
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@components': path.resolve(__dirname, 'src/components'),
                '@contexts': path.resolve(__dirname, 'src/contexts'),
                '@pages': path.resolve(__dirname, 'src/pages'),
                '@hooks': path.resolve(__dirname, 'src/hooks'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@styles': path.resolve(__dirname, 'src/styles'),
                '@assets': path.resolve(__dirname, 'src/assets'),
                '@types': path.resolve(__dirname, 'src/types'),
                '@services': path.resolve(__dirname, 'src/services'),
                '@store': path.resolve(__dirname, 'src/store'),
            },
        },
    };
};
