module.exports = {
	entry: {
		'main': './main.js',
	},
	output: {
		filename: './assets/main.js',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
	},
	module: {
		loaders: [{
			test:    /\.(js|jsx)$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				plugins: ['transform-runtime'],
				presets: ['es2016', 'react', 'stage-2'],
			}
		}, {
			test:   /\.json$/,
			loader: 'json'
		}],
	},
};
