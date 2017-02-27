   const webpack = require('webpack');

   const plugins = [
      new webpack.DefinePlugin({
         "process.env": {
            NODE_ENV: JSON.stringify("production")
         }
     }),
     new webpack.ProvidePlugin({
         _: 'underscore'
     })
   ];

   if (process.env.NODE_ENV == 'production') {
      console.log("production");
      plugins.push(new webpack.optimize.UglifyJsPlugin({
         compress: {
             warnings: false
         }
      }));
   } else {

   }

   const conf = {
      entry: __dirname + '/src/app.js',
      output: {
         path: __dirname + '/public/',
         filename: 'bundle.js'
      },
      plugins: plugins,
      module: {
         loaders: [
            { test:  /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: [['es2015'], ['react']] }},
         ]
      }
   };

   if (require.main == module) {
      webpack(conf, function(err, info) {
         if (err) {
            console.log(err);
         }
         if (info && info.compilation.errors.length) {
            console.log(info.compilation.errors);
         }
      });
   } else {
      module.exports = require('webpack-dev-middleware')(webpack(conf), {
         watchOptions: {
            aggregateTimeout: 300
         },
         noInfo: true,
         publicPath: '/'
      });
   }
