module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        home: '@/views/home',
        network: '@/network'
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
