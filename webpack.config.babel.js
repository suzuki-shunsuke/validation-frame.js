import path from 'path';
import webpack from 'webpack';

module.exports = [
  {
    entry: {
      'dist/simple-getter-setter': './src/simple-getter-setter.js',
      'dist/validation-rule-set': './src/validation-rule-set.js',
      'dist/validation-frame': './src/validation-frame.js',
      'dist/validation-prop': './src/validation-prop.js',
      'dist/validation-model': './src/validation-model.js',
    },
    externals: [{
      'validator': true,
    }],
    resolve: {
      modulesDirectories: ['node_modules'],
      root: [path.resolve('.'),],
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      // new webpack.optimize.UglifyJsPlugin(),
    ],
    output: {
      path: path.join(__dirname),
      filename: '[name].umd.js',
      library: 'validation_frame',
      libraryTarget: 'umd'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        }
      }]
    }
  },
];
