const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions']
                                },
                                modules: "auto" // This should be 'auto' or removed
                            }],
                            ['@babel/preset-react', { runtime: 'automatic' }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ],
    // In devServer section, replace the proxy configuration:
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        open: true,
        port: 3001,
        historyApiFallback: true,
        hot: true,
        proxy: [{
            context: ['/api'],
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};