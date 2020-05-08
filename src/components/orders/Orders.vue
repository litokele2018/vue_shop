<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input @clear="handleClear" clearable placeholder="请输入内容" v-model="orderInfo.query">
            <el-button @click="searchOrders" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderData.goods" border stripe style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="350px"></el-table-column>
        <el-table-column label="订单价格（元）" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status !== '0'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">
            <span>{{new Date(scope.row.create_time * 1000).toLocaleString('zh-CN', {hour12: false})}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-tooltip content="修改订单地址" placement="top">
              <el-button
                @click="handleEdit(scope.row)"
                icon="el-icon-edit"
                size="mini"
                type="primary"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="物流进度" placement="top">
              <el-button
                @click="handleOriented(scope.$index, scope.row)"
                icon="el-icon-location-outline"
                size="mini"
                type="success"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="orderInfo.pagenum"
        :page-size="orderInfo.pagesize"
        :page-sizes="[5, 10, 20, 50]"
        :total="orderData.total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
    <!-- 修改订单地址的对话框 -->
    <el-dialog :visible.sync="editDialogVisible" title="修改地址" width="50%">
      <el-form :model="form" label-width="100px" ref="form">
        <el-form-item label="省市区/县" required>
          <el-cascader
            :options="cityOptions"
            :props="{ expandTrigger: 'hover' }"
            @change="changeProvince"
            v-model="form.city"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" required>
          <el-input v-model="form.addr"></el-input>
        </el-form-item>
      </el-form>

      <span class="dialog-footer" slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editAddr" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度 -->
    <el-dialog :visible.sync="deliveryDialogVisible" title="物流进度" width="50%">
      <div :key="index" v-for="(item, index) in delivery" style="margin-bottom: 15px">
        <span>{{item.time}}</span>
        <span>{{item.context}}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrder, getDelivery } from "../../network/order"
import cityOptions from "../../assets/js/provinces-china-master/city_data2017_element"

export default {
  data() {
    return {
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: ""
      },
      orderData: {},
      editDialogVisible: false,
      deliveryDialogVisible: false,
      cityOptions,
      form: {
        city: "",
        addr: ""
      },
      delivery: []
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    getOrder() {
      getOrder(this.orderInfo).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.orderData = res.data
        }
      })
    },
    handleClear() {},
    searchOrders() {
      this.getOrder()
    },
    handleEdit() {
      this.editDialogVisible = true
    },
    handleOriented() {
      this.deliveryDialogVisible = true
      getDelivery().then(res => {
        this.delivery = res.data
      })
    },
    handleCurrentChange(num) {
      this.orderInfo.pagenum = num
      this.getOrder()
    },
    handleSizeChange(size) {
      this.orderInfo.pagesize = size
      this.getOrder()
    },
    editAddr() {
      this.editDialogVisible = false
    },
    changeProvince() {
      console.log(this.form.city)
    }
  }
}
</script>

<style>
</style>