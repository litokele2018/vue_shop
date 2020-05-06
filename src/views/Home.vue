<template>
  <el-container>
    <el-header>
      <div>
        <img alt src="~assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="exitFunc">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuWidth">
        <div @click="handleToggle" class="toggle">
          <span>|||</span>
        </div>
        <el-menu
          :collapse="isToggle"
          :default-active="saveStatus"
          active-text-color="#409BFF"
          background-color="rgb(50, 55, 68)"
          ref="menu"
          router
          text-color="#fff"
          unique-opened
        >
          <!-- 一级标题 -->
          <el-submenu :index="index.toString()" :key="item.id" v-for="(item, index) in menuList">
            <template slot="title">
              <i :class="icons[index]"></i>
              <span ref="show">{{item.authName}}</span>
            </template>
            <div v-if="item.children.length">
              <!-- 二级标题 -->
              <el-menu-item
                :index="`/${child.path}`"
                :key="child.authName"
                v-for="child in item.children"
              >
                <i class="el-icon-thumb"></i>
                {{child.authName}}
              </el-menu-item>
            </div>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主内容区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { requestMenu } from "../network/request";
export default {
  data() {
    return {
      menuList: [],
      icons: [
        "iconfont icon-users",
        "iconfont icon-tijikongjian",
        "iconfont icon-shangpin",
        "iconfont icon-danju",
        "iconfont icon-baobiao"
      ],
      isToggle: false,
      menuWidth: "200px",
      timer: null,
      saveStatus: ""
    };
  },
  created() {
    this.saveStatus = this.$route.path;
    requestMenu().then(res => {
      if (res.meta.status === 200) {
        this.menuList = res.data;
      } else {
        this.$message.error(res.meta.msg);
      }
    });
  },
  methods: {
    exitFunc() {
      this.$message({
        message: "退出成功",
        type: "success"
      });
      setTimeout(() => {
        this.$router.push("/login");
      }, 1000);
    },
    handleToggle() {
      this.isToggle = !this.isToggle;
      clearInterval(this.timer);
      if (this.isToggle) {
        this.$refs.show.forEach(item => {
          item.style.visibility = "hidden";
        });
        this.timer = setInterval(() => {
          this.menuWidth = parseInt(this.menuWidth) - 30 + "px";
          if (parseInt(this.menuWidth) <= 50) {
            this.menuWidth = "50px";
            clearInterval(this.timer);
          }
        }, 50);
      } else {
        this.timer = setInterval(() => {
          this.menuWidth = parseInt(this.menuWidth) + 30 + "px";
          if (parseInt(this.menuWidth) > 200) {
            this.menuWidth = "200px";
            clearInterval(this.timer);
          }
        }, 50);
      }
    }
  },
  watch: {
    $route(to, from) {
      this.saveStatus = this.$route.path;
      if (this.$route.path === "/welcome") {
        this.$refs.menu.openedMenus.forEach(item => {
          this.$refs.menu.close(item);
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgb(55, 60, 65);
    div {
      img {
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        font-size: 20px;
        color: white;
        margin-left: 20px;
      }
    }
  }
  .el-aside {
    background-color: rgb(50, 55, 68);
    .toggle {
      color: white;
      text-align: center;
      height: 30px;
      line-height: 30px;
      &:hover {
        background-color: grey;
      }
    }
    .el-menu {
      border-right: 0px;
      .iconfont {
        margin-right: 20px;
      }
    }
  }
}
.el-main {
  overflow: hidden;
}
</style>
