const webpack = require('webpack');
const path = require('path');
module.exports = {
  entry:'./index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'upload.js'
  },
  module:{
    rules:[
      {
        test:/\.(js|jsx)$/,
        exclude:"/node_modules/",
        loader:'babel-loader',
        query:{
          presets:['es2015','stage-3']
        }
      }
    ]
  },
}
