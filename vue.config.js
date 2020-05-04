module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        home: '@/views/home',
        network: '@/network',
        views: '@/views',
        components: '@/components'
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
