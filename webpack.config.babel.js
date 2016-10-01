import path from 'path';
import config from 'config'

module.exports = {
	entry: {
	  preload: './' + config.targetDir + '/main.js'
	},
	output: {
		path: path.join(__dirname, config.destDir),
		publicPath: '../' + config.destDir,
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle.js',
		library: 'myLibrary',
		libraryTarget: 'var'
	}
};