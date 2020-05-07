<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert center show-icon title="添加商品信息" type="info"></el-alert>
      <el-steps :active="active" :space="200" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        label-position="top"
        label-width="100px"
        ref="addFormRef"
        status-icon
      >
        <el-tabs
          :before-leave="beforeLeave"
          @tab-click="handleTabClick"
          style="height: 200px;"
          tab-position="left"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name" required>
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" required>
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" required>
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" required>
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="value" required>
              <el-alert show-icon style="height: 20px" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
              <el-cascader
                :options="categoryList"
                :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id'}"
                @change="handleChange"
                clearable
                v-model="addForm.value"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <div :key="index" v-for="(item, index) in activeData">
              <div>{{item.attr_name}}</div>
              <el-tag
                :key="i"
                @close="handleTagClose(item, i)"
                closable
                v-for="(val, i) in item.attr_vals"
              >{{val}}</el-tag>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :key="index" :label="item.attr_name" v-for="(item,index) in staticData">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              :action="uploadUrl"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <el-button @click="addGoodsBtn" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片的对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="预览图片" width="50%">
      <img :src="url" alt="预览图片" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import { getCategoriesList } from "../../network/categories"
import { getParams } from "../../network/params"
import { addGoods } from "../../network/goods"

export default {
  data() {
    return {
      active: 0,
      addForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce: "",
        pics: [],
        attrs: [],
        value: ""
      },
      categoryList: [],
      activeData: [],
      staticData: [],
      uploadUrl: "http://172.81.242.229:8888/api/private/v1/upload",
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewUrl: "http://172.81.242.229:8888/",
      url: "",
      dialogVisible: false
    }
  },
  created() {
    getCategoriesList(3).then(res => {
      this.categoryList = res.data
    })
  },
  methods: {
    beforeLeave(activeName, old) {
      // console.log(activeName, old)
      if (activeName === "0") {
        return true
      }
      if (this.addForm.value.length === 3) {
        this.active = activeName * 1
        return true
      } else {
        this.$message.error("请先选择商品分类")
        return false
      }
    },
    handleTabClick(vm) {},
    handleChange() {
      console.log(this.addForm.value)
      if (this.addForm.value.length !== 3) {
        this.addForm.value = []
        return
      }
      this.addForm.goods_cat = this.addForm.value.join(",")
      getParams(this.addForm.value[2], "many").then(res => {
        res.data.forEach(item => {
          if (item.attr_vals !== "") {
            item.attr_vals = item.attr_vals.split(",")
          }
        })
        this.activeData = res.data
      })
      getParams(this.addForm.value[2], "only").then(res => {
        this.staticData = res.data
      })
    },
    handleTagClose(item, i) {
      item.attr_vals.splice(i, 1)
    },
    handlePreview(file) {
      this.url = this.previewUrl + file.response.data.tmp_path
      this.dialogVisible = true
    },
    handleRemove(file) {
      const tmp_path = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(x => x.pic === tmp_path)
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess(res) {
      if (res.meta.status === 200) {
        let obj = { pic: res.data.tmp_path }
        this.addForm.pics.push(obj)
      }
    },
    addGoodsBtn() {
      this.addForm.attrs = []
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.activeData.forEach(item => {
            item.attr_vals.forEach(val => {
              let obj = {
                attr_id: item.attr_id,
                attr_value: val
              }
              this.addForm.attrs.push(obj)
            })
          })
          this.staticData.forEach(item => {
            let obj = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(obj)
          })
          addGoods(this.addForm).then(res => {
            if (res.meta.status === 201) {
              console.log(res)
              this.$message.success("添加成功")
            } else {
              console.log(res)
              this.$message.error("添加失败")
            }
          })
        } else {
          this.$message.error("请填写正确的表单")
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-steps {
  margin-bottom: 20px;
}
.el-card {
  height: 700px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>