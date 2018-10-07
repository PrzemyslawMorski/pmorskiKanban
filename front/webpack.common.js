const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.tsx'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Kanban pmorski',
      template: 'index.html',
      hash: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', ".json"]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
};
