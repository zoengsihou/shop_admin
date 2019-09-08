<template>
  <div class="login-wrapper">
    <el-row type="flex" class="loginForm" justify="center" align="middle">
      <!-- <el-col :xs="2" :sm="3" :md="4" :lg="5" :xl="6" class="login-content"> -->
      <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6" class="login-content">
        <!-- 登录 -->
        <!-- <el-button type="primary">成功按钮</el-button> -->
        <el-form label-position="top" :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      //  http://localhost:8888/api/private/v1/
      axios
        .post('http://localhost:8888/api/private/v1/login', this.loginForm)
        .then(res => {
          //  ES6中的解构，从res.data中取出属性data和meta
          const { data, meta } = res.data
          // console.log(data)
          if (meta.status === 200) {
            this.$message({
              type: 'success',
              message: meta.msg,
              duration: 1000
            })
            //  将返回的token存储到LocalStorage中
            localStorage.setItem('token', data.token)
            //  登录成功，需要跳转到后台管理的首页
            this.$router.push('home')
          } else {
            // console.log('登录失败', meta.msg)
            this.$message({
              type: 'error',
              message: meta.msg,
              duration: 1000
            })
          }
        })
    },

    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // alert('submit!')
          // console.log(this.loginForm)
          this.login()
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style>
.login-wrapper,
.loginForm {
  height: 100%;
}
.loginForm {
  background-color: #2d434c;
}
.login-content {
  min-width: 240px;
  background-color: #fff;
  padding: 20px 35px;
  border-radius: 10px;
}
</style>
