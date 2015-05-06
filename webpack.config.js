var path = require('path'),
    webpack = require('webpack');

module.exports = {
    cache: true,
    entry: '<%= dirs.js %>xelect2.js',
    output: {
        path: '<%= dirs.dist %>',
        filename: 'xelect2.js'
    },
    resolve: {
        root: ['node_modules', 'bower_components']
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        )
    ]
};
