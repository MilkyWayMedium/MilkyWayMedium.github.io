const path = require('path')

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	watch: true,
	target: "web",
    externals: {
        "express": "require('express')",
    },
	experiments: {
		topLevelAwait: true
	},
	resolve: {
        fallback: { "path": require.resolve("path-browserify"),
					"stream": false,
					"crypto": false,
					"http": false,
					"zlib": false
		}
    }
}