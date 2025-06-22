import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            publicPath: '/',
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
                        'style-loader',
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
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
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
