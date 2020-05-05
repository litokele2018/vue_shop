<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="list-card">
      <el-table :data="list" border style="width: 100%">
        <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "../../network/rights"
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    getRightsList().then(res => {
      if (res.meta.status === 200) {
        this.list = res.data
      }
    })
  }
}
</script>
<style lang="less" scoped>
.list-card {
  margin-top: 15px;
}
</style>