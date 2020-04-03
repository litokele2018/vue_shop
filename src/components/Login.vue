<template>
  <div class="login">
    <div class="login_container">
      <!-- 头像 -->
      <div class="avatar_box">
        <img class="avatar_logo" src="~assets/logo.png" alt />
      </div>
      <el-form ref="form" class="login_form_area" :model="formData" :rules="rules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="formData.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" show-password v-model="formData.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_button">
          <el-button type="primary" @click="handleLoginBtn">登录</el-button>
          <el-button type="primary" @click="handleClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    request
  } from '../network/request'

  export default {
    data() {
      return {
        formData: {
          username: "admin",
          password: "123456"
        },
        rules: {
          username: [{
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            },
            {
              min: 3,
              max: 15,
              message: "长度在 3 到 15 个字符",
              trigger: "blur"
            }
          ],
          password: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            {
              min: 3,
              max: 15,
              message: "长度在 3 到 15 个字符",
              trigger: "blur"
            }
          ]
        }
      }
    },
    methods: {
      handleClick() {
        this.$refs.form.resetFields()
      },
      handleLoginBtn() {
        this.$refs.form.validate((isOk, obj) => {
          // console.log(isOk, obj)
          if (isOk) {
            request({
              method: 'POST',
              url: '/login',
              data: {
                username: this.formData.username,
                password: this.formData.password
              }
            }).then(res => {
              if (res.meta.status === 400) {
                this.$message({
                  message: `请求超时，${res.meta.msg}`,
                  type: 'error'
                })
              } else {
                this.$message({
                  message: '登录成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push('/home')
                }, 1000)
              }
              window.sessionStorage.setItem('token', res.data.token)
            }).catch(err => {
              throw err
            })
          }
        })
      }
    }
  };

</script>

<style lang="less" scoped>
  .login {
    height: 100%;
    background-color: #2b4b6b;

    .login_container {
      position: absolute;
      height: 500px;
      width: 700px;
      background-color: #fff;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      border-radius: 10px;

      .avatar_box {
        position: absolute;
        width: 200px;
        height: 200px;
        background-color: #2b4b6b;
        border: 1px solid #eee;
        border-radius: 50%;
        transform: translateY(-50%);
        left: 0;
        right: 0;
        margin: auto;

        .avatar_logo {
          width: 180px;
          height: 180px;
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 50%;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;
        }
      }

      .login_form_area {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 20px;
        box-sizing: border-box;

        .login_button {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }

</style>>
