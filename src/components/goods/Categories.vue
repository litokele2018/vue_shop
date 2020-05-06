<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="user-card">
      <el-button @click="addCategory" class="addCat" type="primary">添加分类</el-button>
      <tree-table
        :columns="columns"
        :data="categoryList"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        :show-row-hover="false"
        border
        index-text="#"
      >
        <template slot="isValid" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" icon="el-icon-edit" size="mini" type="primary"></el-button>
          <el-button
            @click="handleDelete(scope.row)"
            icon="el-icon-delete"
            size="mini"
            type="danger"
          ></el-button>
        </template>
      </tree-table>
      <el-pagination
        :current-page="pageInfo.currentPage"
        :page-size="5"
        :total="pageInfo.totalNum"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog :visible.sync="addCatDialog" title="添加分类" width="50%">
      <el-form :model="form" label-width="100px" ref="addCatForm" status-icon>
        <el-form-item label="分类名称" prop="cat_name" required>
          <el-input autocomplete="off" v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            :options="pidList"
            :props="{ expandTrigger: 'hover',checkStrictly:true, label: 'cat_name', value: 'cat_id'}"
            @change="handleChange"
            clearable
            v-model="value"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="addCatDialog = false">取 消</el-button>
        <el-button @click="sendAddCat" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog :visible.sync="editCatDialog" title="添加分类" width="50%">
      <el-form :model="form" label-width="100px" ref="aditCatForm" status-icon>
        <el-form-item label="分类名称" prop="cat_name" required>
          <el-input autocomplete="off" v-model="form.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editCatDialog = false">取 消</el-button>
        <el-button @click="sendEdit" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoriesList,
  sendAddCategories,
  editCategory,
  deleteCategory
} from "../../network/categories"

export default {
  data() {
    return {
      pageInfo: {
        currentPage: 1,
        totalNum: 0
      },
      addCatDialog: false,
      editCatDialog: false,
      categoryList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          width: "400px"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isValid",
          minWidth: "50px"
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
          prop: "cat_level"
        },
        {
          label: "操作",
          minWidth: "200px",
          type: "template",
          template: "operation"
        }
      ],
      form: {
        cat_pid: "",
        cat_name: "",
        cat_level: 0,
        cat_id: ""
      },
      pidList: [],
      value: []
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    getCategoriesList() {
      getCategoriesList(3, this.pageInfo.currentPage, 5).then(res => {
        if (res.meta.status === 200) {
          this.categoryList = res.data.result
          this.pageInfo.totalNum = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val
      this.getCategoriesList()
    },
    addCategory() {
      this.form.cat_pid = 0
      this.form.cat_name = ""
      this.form.cat_level = 0
      this.addCatDialog = true
      getCategoriesList(2).then(res => {
        if (res.meta.status === 200) {
          this.pidList = res.data
        }
      })
    },
    async sendAddCat() {
      const res = await sendAddCategories(this.form)
      console.log(res)
      if (res.meta.status === 201) {
        this.$message.success("创建成功")
        this.getCategoriesList()
        this.addCatDialog = false
      } else {
        this.$message.error("创建失败")
      }
    },
    // 编辑按钮
    handleEdit(row) {
      this.form.cat_id = row.cat_id
      this.form.cat_name = row.cat_name
      this.editCatDialog = true
    },
    async sendEdit() {
      const ok = window.confirm("确认修改")
      if (ok) {
        const res = await editCategory(this.form.cat_id, this.form.cat_name)
        if (res.meta.status === 200) {
          this.$message.success("修改成功")
          this.getCategoriesList()
        } else {
          this.$message.error("修改失败")
        }
      }
    },
    // 删除按钮
    async handleDelete(row) {
      const ok = window.confirm("确认删除")
      if (ok) {
        const res = await deleteCategory(row.cat_id)
        if (res.meta.status === 200) {
          this.$message.success("删除成功")
          this.getCategoriesList()
        } else {
          this.$message.error("删除失败")
        }
      }
    },
    // 选择项发生变化
    handleChange() {
      console.log(this.value)
      this.form.cat_level = this.value.length
      this.form.cat_pid = this.value[this.value.length - 1]
      console.log(this.form.cat_level, this.form.cat_pid)
    }
  }
}
</script>

<style lang="less">
.el-breadcrumb {
  margin-bottom: 10px;
}
.addCat {
  margin-bottom: 10px;
}
.zk-table {
  max-height: 700px;
  overflow-y: scroll!important;
  -webkit-overflow-scrolling: touch;
}
.el-scrollbar {
  height: 500px;
}
.el-scrollbar__wrap {
  overflow-y: scroll;
}
</style>