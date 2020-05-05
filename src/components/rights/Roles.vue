<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="list-card">
      <el-button @click="addRole" class="add-role-btn" mini type="primary">添加角色</el-button>
      <el-table :data="roleList" @expand-change="expandChange" border style="width: 100%">
        <!-- 展开的内容 -->
        <el-table-column class="expand" type="expand">
          <template slot-scope="scope">
            <!-- 一级 -->
            <el-row
              :class="index === 0? 'first': 'else'"
              :key="index"
              v-for="(item, index) in scope.row.children"
            >
              <el-col :span="5" class="first-col">
                <el-tag @close="handleTagClose(item, scope.row)" closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19" class="second">
                <!-- 二级 -->
                <el-row :class="j === 0 ? '': 'top'" :key="j" v-for="(i, j) in item.children">
                  <el-col :span="6">
                    <el-tag
                      @close="handleTagClose(i, scope.row)"
                      closable
                      type="success"
                    >{{i.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <!-- 三级 -->
                    <el-tag
                      :key="g"
                      @close="handleTagClose(h,scope.row)"
                      closable
                      type="warning"
                      v-for="(h, g) in i.children"
                    >{{h.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 内容主体 -->
        <el-table-column align="center" label="#" type="index" width="80"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" content="编辑" effect="dark" placement="top">
              <el-button
                @click="editRole(scope.row)"
                icon="el-icon-edit"
                size="small"
                type="primary"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="删除" effect="dark" placement="top">
              <el-button
                @click="deleteRole(scope.row)"
                icon="el-icon-delete"
                size="small"
                type="danger"
              ></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="分配权限" effect="dark" placement="top">
              <el-button
                @click="asignRights(scope.$index,scope.row)"
                icon="el-icon-setting"
                size="small"
                type="warning"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog :visible.sync="asignRightsDialog" title="提示" width="30%">
      <el-tree
        :data="treeRightsList"
        :default-checked-keys="defaultId"
        :key="index"
        :props="defaultProps"
        default-expand-all
        node-key="id"
        ref="tree"
        show-checkbox
      ></el-tree>
      <span class="dialog-footer" slot="footer">
        <el-button @click="asignRightsDialog = false">取 消</el-button>
        <el-button @click="sendRightChange" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog :visible.sync="addRoleDialog" title="添加角色" width="30%">
      <el-form :model="form" label-width="100px" ref="addRoleForm" status-icon>
        <el-form-item label="角色名称" prop="authName" required>
          <el-input autocomplete="off" v-model="form.authName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" required>
          <el-input autocomplete="off" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button @click="sendAddRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog :visible.sync="editRoleDialog" title="编辑角色" width="30%">
      <el-form :model="form" label-width="100px" ref="addRoleForm" status-icon>
        <el-form-item label="角色名称" prop="authName" required>
          <el-input autocomplete="off" v-model="form.authName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input autocomplete="off" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button @click="sendEditRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  deleteRoleRights,
  getRightsList,
  changeRoleRights,
  addRole,
  editRole,
  deleteRole
} from "../../network/rights"
export default {
  data() {
    return {
      roleList: [],
      treeRightsList: [],
      asignRightsDialog: false,
      addRoleDialog: false,
      editRoleDialog: false,
      index: 0,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      defaultId: [],
      currentRoleId: "",
      expandArr: [],
      form: {
        authName: "",
        roleDesc: "",
        roleId: 0
      }
    }
  },
  created() {
    getRoleList().then(res => {
      if (res.meta.status === 200) {
        this.roleList = res.data
      }
    })
    getRightsList("tree").then(res => {
      if (res.meta.status === 200) {
        this.treeRightsList = res.data
      }
    })
  },
  methods: {
    async handleTagClose(item, row) {
      const handler = (arr, id) => {
        let len = arr.length
        for (let i = 0; i < len; i++) {
          if (arr[i].id === id) {
            arr.splice(i, 1)
            return
          }
          if (arr[i].children && Array.isArray(arr[i].children)) {
            handler(arr[i].children, id)
          }
        }
      }
      const roleId = row.id
      let ok = window.confirm("确认删除？")
      let id = item.id
      if (ok) {
        handler(this.roleList, id)
        const res = await deleteRoleRights(roleId, id)
        if (res.meta.status === 200) {
          this.$message.success("取消权限成功！")
          console.log(res)
        } else {
          this.$message.error("取消失败，请重新尝试")
        }
      }
    },
    asignRights($index, row) {
      this.defaultId = []
      let temp = []
      this.currentRoleId = row.id
      const handler = arr => {
        if (!arr.length) return
        let len = arr.length
        for (let i = 0; i < len; i++) {
          if (arr[i].children) {
            handler(arr[i].children)
          } else {
            temp.push(arr[i].id)
          }
        }
      }
      this.index = $index
      handler(this.roleList[$index].children)
      console.log(temp)
      this.defaultId = temp
      this.asignRightsDialog = true
    },
    async sendRightChange(id) {
      this.asignRightsDialog = false
      let arr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const res = await changeRoleRights(this.currentRoleId, arr.join(","))
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success("更新成功")
        getRoleList().then(res => {
          if (res.meta.status === 200) {
            this.roleList = res.data
          }
        })
      } else {
        this.$message.error("更新失败")
      }
    },
    // 展开行
    expandChange(e1, e2) {
      this.currentRoleId = e1.id
    },
    // 添加角色
    addRole() {
      this.addRoleDialog = true
      this.form.authName = ""
      this.form.roleDesc = ""
    },
    // 发送添加角色请求
    async sendAddRole() {
      const res = await addRole(this.form.authName, this.form.roleDesc)
      if (res.meta.status === 201) {
        this.$message.success("添加成功")
        // 重新渲染roleList
        getRoleList().then(res => {
          if (res.meta.status === 200) {
            this.roleList = res.data
            this.addRoleDialog = false
          }
        })
      } else {
        this.$message.error("添加失败")
      }
    },
    // 编辑角色
    editRole(row) {
      this.form.roleId = row.id
      this.form.authName = row.roleName
      this.form.roleDesc = row.roleDesc
      this.editRoleDialog = true
    },
    async sendEditRole() {
      const res = await editRole(this.form)
      if (res.meta.status === 200) {
        this.$message.success("修改成功")
        // 重新渲染roleList
        getRoleList().then(res => {
          if (res.meta.status === 200) {
            this.roleList = res.data
            this.editRoleDialog = false
          }
        })
      } else {
        this.$message.error("修改失败")
      }
    },
    // 删除角色
    async deleteRole(row) {
      let ok = window.confirm("确定要删除这个角色？？？")
      // 减少网络请求
      if (!ok) return
      const res = await deleteRole(row.id)
      if (res.meta.status === 200) {
        this.$message.success("删除成功")
        this.roleList.forEach((item, index) => {
          if (item.id === row.id) {
            this.roleList.splice(index, 1)
            return
          }
        })
      } else {
        this.$message.error("删除失败")
      }
    }
  }
}
</script>

<style lang="less">
.el-table {
  min-width: 999px;
}
.first {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.else {
  border-bottom: 1px solid #eee;
}
.top {
  border-top: 1px solid #eee;
}
.list-card {
  margin-top: 15px;
}
.add-role-btn {
  margin-bottom: 10px;
}
.el-tag {
  margin: 7px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>