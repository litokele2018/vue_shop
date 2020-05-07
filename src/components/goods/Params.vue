<template>
  <div>
    <el-breadcrumb class="hy-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <span>请选择商品分类 ：</span>
      <el-cascader
        :options="idList"
        :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id'}"
        @change="handleChange"
        clearable
        v-model="value"
      ></el-cascader>
      <el-tabs @tab-click="handleTabChange" v-model="activeName">
        <el-tab-pane label="动态参数" name="first">
          <el-button @click="addParams" size="mini" type="primary">添加参数</el-button>
          <el-table :data="activeData" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  @close="handleTagClose(index, scope.row)"
                  class="tags"
                  closable
                  v-for="(item, index) in scope.row.attr_vals.split(',')"
                >{{item}}</el-tag>
                <el-input
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                  ref="saveTagInput1"
                  size="small"
                  v-if="activeAttrInfo.inputVisible"
                  v-model="activeAttrInfo.newTagVal"
                ></el-input>
                <el-button
                  @click="showActiveInput"
                  class="button-new-tag"
                  size="small"
                  v-else
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="handleEdit(scope.row)"
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                ></el-button>
                <el-button
                  @click="handleDelete(scope.$index, scope.row)"
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="second">
          <el-button @click="addParams" size="mini" type="primary">添加属性</el-button>
          <el-table :data="staticData" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  @close="handleTagClose(index, scope.row)"
                  class="tags"
                  closable
                  v-for="(item, index) in scope.row.attr_vals.split(',')"
                >{{item}}</el-tag>
                <el-input
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                  ref="saveTagInput2"
                  size="small"
                  v-if="staticAttrInfo.inputVisible"
                  v-model="staticAttrInfo.newTagVal"
                ></el-input>
                <el-button
                  @click="showStaticInput"
                  class="button-new-tag"
                  size="small"
                  v-else
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="handleStaticEdit(scope.row)"
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                ></el-button>
                <el-button
                  @click="handleStaticDelete(scope.$index, scope.row)"
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :visible.sync="addParamsDialog" title="添加参数或属性" width="50%">
      <el-form :model="form" label-width="100px" ref="addParamsForm" status-icon>
        <el-form-item label="参数名称" prop="attr_name" required>
          <el-input autocomplete="off" v-model="form.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select placeholder="请选择" v-model="form.attr_sel">
            <el-option
              :key="index"
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in form.options"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_vals" required>
          <el-input autocomplete="off" v-model="form.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addParamsDialog = false">取 消</el-button>
        <el-button @click="sendAddParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoriesList } from "../../network/categories"
import {
  getParams,
  addParams,
  editParams,
  deleteParams
} from "../../network/params"

export default {
  data() {
    return {
      idList: [],
      value: [],
      activeName: "first",
      activeData: [],
      staticData: [],
      activeAttrInfo: {
        attr_vals: "",
        newTagVal: "",
        inputVisible: false
      },
      staticAttrInfo: {
        attr_vals: "",
        newTagVal: "",
        inputVisible: false
      },
      addParamsDialog: false,
      form: {
        cat_id: 0,
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
        options: [
          {
            value: "many",
            label: "动态参数"
          },
          {
            value: "only",
            label: "静态属性"
          }
        ]
      }
    }
  },
  created() {
    getCategoriesList(3).then(res => {
      this.idList = res.data
    })
  },
  methods: {
    handleChange() {
      if (this.value.length < 3) {
        return
      }
      this.form.cat_id = this.value[2]
      // 获取动态参数
      getParams(this.value[2], "many").then(res => {
        if (res.meta.status === 200) {
          this.activeData = res.data
          console.log(res.data)
        }
      })
      // 获取静态参数
      getParams(this.value[2], "only").then(res => {
        if (res.meta.status === 200) {
          this.staticData = res.data
          console.log(res.data)
        }
      })
    },
    handleTabChange() {},
    addParams() {
      this.addParamsDialog = true
    },
    handleEdit(row) {
      console.log("展开修改吧")
    },
    handleStaticEdit(row) {
      console.log("展开修改吧")
    },
    sendAddParams() {
      addParams(
        this.form.cat_id * 1,
        this.form.attr_name,
        this.form.attr_sel,
        this.form.attr_vals
      ).then(res => {
        if (res.meta.status === 201) {
          this.$message.success("添加成功")
          if (this.form.attr_sel === "only") {
            this.staticData.push({
              attr_id: res.data.attr_id,
              attr_name: this.form.attr_name,
              attr_sel: this.form.attr_sel,
              attr_write: res.data.attr_write,
              cat_id: this.form.cat_id,
              attr_vals: this.form.attr_vals
            })
          } else {
            this.activeData.push({
              attr_id: res.data.attr_id,
              attr_name: this.form.attr_name,
              attr_sel: this.form.attr_sel,
              attr_write: res.data.attr_write,
              cat_id: this.form.cat_id,
              attr_vals: this.form.attr_vals
            })
          }
          this.addParamsDialog = false
        } else {
          console.log(res)
          this.$message.error("添加失败")
        }
      })
    },
    handleDelete(index, row) {
      const ok = window.confirm("确认删除")
      if (ok) {
        deleteParams(row.cat_id, row.attr_id).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("删除成功")
            this.activeData.splice(index, 1)
          } else {
            console.log(res)
            this.$message.error("删除失败")
          }
        })
      }
    },
    handleStaticDelete(index, row) {
      const ok = window.confirm("确认删除")
      if (ok) {
        deleteParams(row.cat_id, row.attr_id).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("删除成功")
            this.staticData.splice(index, 1)
          } else {
            this.$message.error("删除失败")
          }
        })
      }
    },
    handleInputConfirm(row) {
      this.activeAttrInfo.inputVisible = false
      this.staticAttrInfo.inputVisible = false
      if (row.attr_sel === "many") {
        if (this.activeAttrInfo.newTagVal === "") return
        row.attr_vals += "," + this.activeAttrInfo.newTagVal
        editParams(
          row.cat_id,
          row.attr_id,
          row.attr_name,
          "many",
          row.attr_vals
        ).then(res => {
          if (res.meta.status === 200) {
            console.log(res)
            this.$message.success("添加成功")
          } else {
            console.log(res)
            this.$message.error("添加失败")
          }
        })
      } else {
        if (this.staticAttrInfo.newTagVal === "") return
        row.attr_vals += "," + this.staticAttrInfo.newTagVal
        editParams(row.cat_id, row.attr_name, "only", row.attr_vals).then(
          res => {
            if (res.meta.status === 200) {
              this.$message.success("添加成功")
            } else {
              this.$message.error("添加失败")
            }
          }
        )
      }
    },
    showActiveInput() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.saveTagInput1.focus()
        })
      })
      this.activeAttrInfo.inputVisible = true
    },
    showStaticInput() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.saveTagInput2.focus()
        })
      })
      this.staticAttrInfo.inputVisible = true
    },
    handleTagClose(index, row) {
      const ok = window.confirm("确认删除tag")
      if (ok) {
        row.attr_vals = row.attr_vals.split(",")
        row.attr_vals.splice(index, 1)
        row.attr_vals = row.attr_vals.join(",")
        editParams(
          row.cat_id,
          row.attr_id,
          row.attr_name,
          row.attr_sel,
          row.attr_vals
        ).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("删除成功")
          } else {
            console.log(res)
            this.$message.error("删除失败")
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
.hy-breadcrumb {
  margin-bottom: 10px;
}
.el-alert {
  margin-bottom: 10px;
}
.el-scrollbar__wrap {
  height: 500px;
}
.tags {
  margin-right: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>