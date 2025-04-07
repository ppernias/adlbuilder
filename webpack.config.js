const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    common: './app/static/ts/common.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'app/static/js'),
    clean: true // Limpia el directorio de salida antes de generar nuevos archivos
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts']  // Solo permitimos extensiones de TypeScript
  },
  devtool: 'source-map'
};
