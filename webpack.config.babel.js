const { join } = require('path');

module.exports = {
    entry: './src/index',
    output: {
        path: join(__dirname, 'lib/umd'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'FunctionalValidation',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
            },
        ],
    },
};
