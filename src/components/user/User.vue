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
          <el-input
            @clear="handleClear"
            class="user-search-input"
            clearable
            placeholder="请输入内容"
            v-model="query"
          >
            <el-button @click="searchUser" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button @click="addUserBtn" class="add_user_btn" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" border stripe style="width: 100%">
        <el-table-column label="#" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="角色" prop="role_name" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="handleStateChange(scope.row)"
              active-color="#409EFF"
              inactive-color="#e3e3e3"
              v-model="scope.row.mg_state"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.$index, scope.row, scope.column, scope.store)"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              @click="deleteUser(scope.row)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            ></el-button>
            <el-tooltip :enterable="false" content="分配角色" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="mini" type="warning"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[1, 2, 5, 10]"
        :total="totalNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialogVisible"
      @close="dialogColse"
      title="提示"
      width="50%"
    >
      <!-- 对话框表单内容 -->
      <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="addRuleForm" status-icon>
        <el-form-item label="用户名" prop="username" required>
          <el-input autocomplete="off" v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" required>
          <el-input autocomplete="off" type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" required>
          <el-input autocomplete="off" type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNum" required>
          <el-input v-model.number="ruleForm.phoneNum"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="editUserDialog" title="提示" width="30%">
      <el-form :model="editInfo" :rules="rules" label-width="100px" ref="editRuleForm" status-icon>
        <el-form-item label="用户名" prop="editUsername">
          <el-input autocomplete="off" disabled v-model="editInfo.editUsername"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="editInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" required>
          <el-input v-model.number="editInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button @click="editUserInfo" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersList,
  putStateChange,
  postNewUser,
  deleteUser,
  editUser
} from "network/user.js"
export default {
  data() {
    const checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.addRuleForm.validateField("checkPass")
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱!"))
        return
      }
      const reg = /(.+)@(.+)/g
      let re = value.match(reg)
      if (Array.isArray(re) && re.length) {
        callback()
      } else {
        callback(new Error("请输入正确的邮箱!"))
      }
    }
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"))
      } else if (value.toString().length !== 11) {
        callback(new Error("请输入正确的手机号"))
      } else {
        callback()
      }
    }
    return {
      usersList: [],
      pageSize: 2,
      currentPage: 1,
      query: "",
      totalNum: 4,
      dialogVisible: false,
      editUserDialog: false,
      ruleForm: {
        username: "",
        pass: "",
        checkPass: "",
        email: "",
        phoneNum: ""
      },
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
        phoneNum: [{ validator: validatePhoneNum, trigger: "blur" }]
      },
      editInfo: {
        id: 0,
        editUsername: "",
        email: "",
        mobile: ""
      }
    }
  },
  created() {
    this.getUsersList(1, this.pageSize, this.query)
  },
  methods: {
    // 请求用户信息
    getUsersList(page, pagesize, query) {
      getUsersList(page, pagesize, query).then(res => {
        if (res.meta.status === 200) {
          this.usersList = res.data.users
          this.totalNum = res.data.total
        }
      })
    },
    // 编辑用户信息
    handleEdit($index, row, column, store) {
      this.editInfo.editUsername = row.username
      this.editInfo.id = row.id
      this.editUserDialog = true
    },
    // 当前 页 变化
    handleCurrentChange(val) {
      this.getUsersList(val, this.pageSize, this.query)
    },
    // 页面显示数量变化
    handleSizeChange(val) {
      this.pageSize = val
      this.getUsersList(this.currentPage, val, this.query)
    },
    // 状态修改
    async handleStateChange(row) {
      // 发送请求让服务器保存修改
      const res = await putStateChange(row.id, row.mg_state)
      if (res.meta.status === 200) {
        this.$message.success("用户状态修改成功")
        return
      }
      this.$message.error("用户状态修改失败")
      row.mg_state = !row.mg_state
    },
    // 搜索用户
    searchUser() {
      this.getUsersList(1, this.pageSize, this.query)
    },
    // 清除输入信息
    handleClear() {
      this.getUsersList(1, this.pageSize, this.query)
    },
    // 对话框关闭前
    handleClose() {
      let isOk = window.confirm("确认关闭？")
      if (isOk) {
        this.dialogVisible = false
      }
    },
    // 添加用户按钮
    addUserBtn() {
      // 显示对话框
      this.dialogVisible = true
    },
    // 关闭对话框时
    dialogColse() {
      this.$refs.addRuleForm.resetFields()
    },
    // 添加用户请求
    addUser() {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) return
        // 这里可以发送请求
        const res = await postNewUser({
          username: this.ruleForm.username,
          password: this.ruleForm.pass,
          email: this.ruleForm.email,
          mobile: this.ruleForm.phoneNum
        })
        if (res.meta.status === 201) {
          this.$message.success(this.ruleForm.username + "添加成功")
          this.getUsersList(this.currentPage, this.pageSize, this.query)
        } else {
          this.$message.error(this.ruleForm.username + "添加失败")
          return
        }
        this.dialogVisible = false
      })
    },
    // 删除用户
    async deleteUser(row) {
      const ok = window.confirm("确定要删除该用户吗？")
      if (!ok) return
      console.log(row.id)
      const res = await deleteUser(row.id)
      if (res.meta.status === 200) {
        this.$message.success("删除成功")
        this.getUsersList(this.currentPage, this.pageSize, this.query)
      } else {
        this.$message.error("删除失败")
      }
    },
    // 编辑用户信息
    editUserInfo() {
      // 首先检查一下
      this.$refs.editRuleForm.validate(async valid => {
        if (valid) {
          // 发送请求
          const res = await editUser(this.editInfo)
          console.log(res)
          if (res.meta.status === 200) {
            this.$message.success('更新成功!')
            this.editUserDialog = false
            this.getUsersList(this.currentPage, this.pageSize, this.query)
          } else {
            this.$message.success('更新失败!')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-card {
  margin-top: 20px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
.el-table {
  margin: 20px auto;
}
</style>