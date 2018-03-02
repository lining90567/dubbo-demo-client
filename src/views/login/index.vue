<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm" autoComplete="on" label-position="left">
      <div class="login-header">
        <strong class="login-title">系统登录</strong>
      </div>
      <div class="login-body">
        <img class="profile-img" src="../../assets/images/people.png" alt="">
        <el-form-item prop="username">
          <el-input name="username" size="medium" v-model="loginForm.username" autoComplete="on" autofocus="autofocus" placeholder="用户名">
            <div class="login-username" slot="prepend"></div>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" type="password" size="medium" v-model="loginForm.password" placeholder="口令" @keyup.enter.native="doLogin">
            <template slot="prepend"><div class="login-password"></div></template>
          </el-input>
        </el-form-item>
        <el-button type="primary" :loading="showLoading" @click.native.prevent="doLogin">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/api/auth'
import { getAuthorizedRouter } from '@/api/router'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      displayLoading: false,
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入口令', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['showLoading'])
  },
  methods: {
    doLogin() {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)
          getToken(this.loginForm.username, this.loginForm.password)
            .then(response => {
              sessionStorage.setItem('currentUser', JSON.stringify({
                id: response.data.userId,
                name: response.data.username
              }))
              sessionStorage.setItem('token', response.data.token)
              sessionStorage.setItem('routers', JSON.stringify(response.data.routers))

              // 初始化首页路由
              this.initIndexRouter()

              let redirect = decodeURIComponent(
                this.$route.query.redirect || "/"
              )
              this.$router.push(redirect);
              this.$store.dispatch('setLoading', false)
            })
            .catch(error => {
              this.$store.dispatch('setLoading', false)
              this.$message({
                showClose: true,
                message: error,
                type: 'error'
              })
            })
        }
      })
    },
    initIndexRouter() {
      let indexRouter = {
        path: '/',
        name: "/",
        component: resolve => require(['@/views/home/index'], resolve),
        children: [...this.generateChildRouters()]
      }
      this.$router.addRoutes([indexRouter])
    },
    generateChildRouters() {
      if (!sessionStorage.routers) {
        return []
      }

      let routers = JSON.parse(sessionStorage.routers)
      let childRouters = []
      for(let router of routers) {
        if(router.code != null) {
          let routerProps = JSON.parse(router.properties)
          let childRouter = {
            path: router.url,
            name: router.code,
            component: resolve => require(['@/views/' + router.code + '/index'], resolve),
            meta: { routerId: router.id, requiresAuth: routerProps.meta.requiresAuth, nameFullPath: routerProps.nameFullPath }
          }
          childRouters.push(childRouter)      
        }
      }
      return childRouters
    }    
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  .el-input {
    width: 100%;
  }
  .el-button {
    width: 100%;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 350px;
    margin: 120px auto;
    margin-bottom: 20px;
    border: 1px solid #e0dedb;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }
  .login-header {
    padding: 10px 15px;
    border-bottom: 1px solid #d0cdc7;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    background-color: #f6f5f4;
    .login-title {
      font-size: 20px;
    }
  }
  .login-body {
    padding: 20px 20px;
    text-align: center;
    .profile-img {
      width: 96px;
      height: 96px;
      margin: 0 auto 10px;
      display: block;
    }
    .login-username {
      width: 20px;
      height: 20px;
      margin: 0px -10px;
      background-image: url("../../assets/images/user.png");
    }
    .login-password {
      width: 20px;
      height: 20px;
      margin: 0px -10px;
      background-image: url("../../assets/images/lock.png");
    }
  }
}
</style>
