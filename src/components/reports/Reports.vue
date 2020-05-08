<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div ref="echarts" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import Echarts from "echarts"
import loadsh from "lodash"

import { getReportsData } from "../../network/reports"
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    }
  },
  mounted() {
    getReportsData().then(res => {
      if (res.meta.status === 200) {
        this.option = res.data
        let myChart = Echarts.init(this.$refs.echarts)
        let result = loadsh.merge(res.data, this.options)
        myChart.setOption(result)
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>