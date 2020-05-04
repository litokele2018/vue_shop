<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="user-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input class="user-search-input" placeholder="请输入内容">
            <el-button icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button class="add_user_btn" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" stripe style="width: 100%">
        <el-table-column label="#" width="100">
          <template slot-scope="scope">{{scope.$index}}</template>
        </el-table-column>
        <el-table-column label="姓名" prop="username" width="100"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.$index, scope.row, scope.column, scope.store)"
              size="mini"
            >编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getUsersList } from 'network/user.js'
export default {
  data() {
    return {
      usersList: []
    }
  },
  created() {
    getUsersList(1, 2).then(res => {
      if (res.meta.status === 200) {
        this.usersList = res.data.users
      }
    })
  },
  methods: {
    handleEdit($index, row, column, store) {
      console.log($index, row, column, store)
    }
  }
}
</script>

<style lang="less" scoped>
.user-card {
  margin-top: 20px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
</style>