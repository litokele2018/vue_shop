// 导入速度分析插件
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

// 导入体积分析插件
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// 实例化速度分析插件
const smp = new SpeedMeasurePlugin();


module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        home: '@/views/home',
        network: '@/network',
        views: '@/views',
        components: '@/components'
      },
      extensions: ['.js', '.vue', '.css']
    },
    module: {
      rules: [{
        test: /\.less$/,
        use: 'less-loader'
      }, ]
    },
    plugins: [
      // 实例化体积分析插件
      new BundleAnalyzerPlugin()
    ]
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.entry('app').clear().add('./src/main_prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main_dev.js')
    })
  }
}