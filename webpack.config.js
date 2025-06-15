const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '',
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    port: 8080
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),

  ]
};


/*
//newCode
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProd ? '[name].[contenthash].js' : '[name].js',
    publicPath: '', // масштабирование путей при необходимости
  },
  mode: isProd ? 'production' : 'development',
  devtool: isDev ? 'source-map' : false, // исходники в dev
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // новая форма для static
    },
    open: true,
    compress: true,
    port: 8080,
    hot: true, // включить HMR
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // исправлено на RegExp
        use: {
          loader: 'babel-loader',
          options: {
            // можно здесь конфигурацию babel указать (или .babelrc)
            cacheDirectory: true, // ускорение сборки
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff2?|eot|ttf|otf)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // inline если меньше 8кб, иначе отдельный файл
          },
        },
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
      },
      {
        test: /\.css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader', // выбор загрузчика по режиму
          {
            loader: 'css-loader',
            options: { importLoaders: 1, sourceMap: isDev },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: isDev },
          },
        ],
      },
      // можно добавить поддержку SASS/SCSS, если нужно
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: isProd ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      } : false,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all', // оптимизация разделения кода
    },
    runtimeChunk: 'single',
  },
  resolve: {
    extensions: ['.js'], // расширения файлов для импорта
  },
};
*/