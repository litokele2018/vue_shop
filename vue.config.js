module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets'
      }
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: 'less-loader'
        },
      ]
    }

  }
}
