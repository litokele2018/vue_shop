<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input @clear="handleClear" clearable placeholder="请输入内容" v-model="query">
            <el-button @click="searchGoods" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button @click="addGoodsBtn" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsInfo.goodsList" border stripe style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{new Date(scope.row.add_time * 1000).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
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
      <el-pagination
        :current-page="pagenum"
        :page-size="pagesize"
        :page-sizes="[5, 10, 20, 50]"
        :total="goodsInfo.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods } from "../../network/goods"

export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 10,
      goodsInfo: {
        goodsList: [],
        total: 0
      }
    }
  },
  created() {
    getGoodsList(this.query, this.pagenum, this.pagesize).then(res => {
      if (res.meta.status === 200) {
        this.goodsInfo.goodsList = res.data.goods
        this.goodsInfo.total = res.data.total
      }
    })
  },
  methods: {
    getGoodsList() {
      getGoodsList(this.query, this.pagenum, this.pagesize).then(res => {
        if (res.meta.status === 200) {
          this.goodsInfo.goodsList = res.data.goods
          this.goodsInfo.total = res.data.total
        }
      })
    },
    handleClear() {
      this.query = ""
    },
    searchGoods() {
      this.getGoodsList()
    },
    addGoodsBtn() {
      this.$router.push("/addGoods")
    },
    handleEdit() {},
    handleDelete(index, row) {
      console.log(index)
      const ok = window.confirm("确定删除该商品?")
      if (ok) {
        deleteGoods(row.goods_id).then(res => {
          if (res.meta.status === 200) {
            this.$message.success("删除成功")
            this.goodsInfo.goodsList.splice(index, 1)
          } else {
            this.$message.success("删除失败")
          }
        })
      }
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.query = ""
      this.getGoodsList()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.query = ""
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>