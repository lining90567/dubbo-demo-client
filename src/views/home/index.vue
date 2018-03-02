<template>
  <el-container class="body-container">
    <personal-info ref="personalInfo" v-on:username-changed="doGetCurrentUsername"></personal-info>
    <div class="aside-container">
      <div id="asideHeader" class="aside-header">{{ header }}</div>
      <sidebar :isCollapse="isCollapse" :routers="routers"></sidebar>
    </div>
    <el-main class="main">
      <el-header class="main-header" height="56px">
        <el-row>
          <el-col :span="12">
            <svg t="1492500959545" @click="toggleClick" class="wscn-icon hamburger" :class="{'is-active':isActive}" style="" viewBox="0 0 1024 1024" width="64" height="64" fill="#fff">
              <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
                p-id="1692"></path>
              <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
                p-id="1693"></path>
              <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
                p-id="1694"></path>
            </svg>
          </el-col>
          <el-col :span="12" class="header-function">
            <el-dropdown @command="handleCommand">
              <a class="personal-link">
                <img src="../../assets/images/personal_avatar.png" alt="">
                <span class="username">{{ currentUsername }}</span>
              </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="personalInfo">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>              
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <template v-for="breadcrembItem in breadcrumbItems">
          <template v-if="breadcrembItem.to === ''">
            <el-breadcrumb-item>{{ breadcrembItem.title }}</el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item :to="{ 'path': breadcrembItem.to }">{{ breadcrembItem.title }}</el-breadcrumb-item>
          </template>
        </template>
      </el-breadcrumb>
      <div class="main-content">
        <transition name="fade" mode="out-in">
					<router-view></router-view>
				</transition>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Sidebar from '@/components/sidebar'
import PersonalInfo from '@/components/user/personalInfo'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      isActive: true,
      isCollapse: false,
      header: 'Dubbo demo',
      currentUsername: ''
    }
  },
  methods: {
    toggleClick() {
      this.isActive = !this.isActive
      this.isCollapse = !this.isCollapse
      this.header = this.isCollapse ? 'Dub' : 'Dubbo demo'
    },
    handleCommand(command) {
      switch(command) {
        case 'logout':
          sessionStorage.clear()
          this.$router.push('/login')
          // 模拟f5刷新，避免出现Duplicate named routes definition警告。
          this.$router.go(0)
          break
        case 'personalInfo':
          this.$refs.personalInfo.$emit('openPersonalInfoDialog')
      }
    },
    doGetCurrentUsername() {
      this.currentUsername = JSON.parse(sessionStorage.getItem('currentUser')).name
    }
  },
  computed: {
    routers() {
      let items = [];
      let routers = JSON.parse(sessionStorage.getItem('routers'))
      for (let router of routers) {
        let routerProperties = JSON.parse(router.properties)
        let item = {
          id: router.id,
          code: router.code,
          name: router.name,
          url: router.url,
          level: router.level,
          parentId: router.parentId,
          nameFullPath: routerProperties.nameFullPath,
          cssClass: routerProperties.cssClass,
          component: routerProperties.component
        }
        items.push(item)
      }
      return items
    },
    ...mapGetters(['breadcrumbItems'])
  },
  created: function() {
    this.doGetCurrentUsername()
  },
  components: { Sidebar, PersonalInfo }
};
</script>

<!-- 全局样式 -->
<style>
@import '../../assets/css/common.css';
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.body-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .aside-container {
    height: 100%;
    background-color: #223233;
    margin: 0px;
    padding: 0px;
  }
}

.aside-header {
  background-color: #127ea3;
  color: #fff;
  font-size: 16pt;
  text-align: center;
  margin: 0px auto;
  padding: 0px;
  line-height: 56px;
  width: 100%;
}

.nav-menu {
  border: none;
}
.nav-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
  overflow: auto;
}

.main {
  margin: 0px;
  padding: 0px;
  width: 100%;
  overflow: hidden;
  .main-header {
    background-color: #018cb7;
    padding-right: 10px;
    .header-function {
      text-align: right;
      line-height: 56px;
      .personal-link {
        padding: 13px 10px 14px;
        text-decoration: none;
      }
      .personal-link:hover {
        background-color:#157D9D;
      }
      img {
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
         border-radius: 50%;
         vertical-align:middle;    
      }
      .username {
        margin-left: 3px;
        font-size: 10pt;
        color: #fff;
      }
    }
  }
  .main-content {
    margin: 10px;
    overflow: auto;
  }
  .el-breadcrumb {
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    border-radius: 0px;
    background-color: #F5F4F4;
    border-bottom: solid 1px #eeeeee;
  }
}

.hamburger {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  transform: rotate(90deg);
  transition: 0.38s;
  transform-origin: 50% 50%;
  margin: 20px 0px 0px -10px;
}
.hamburger.is-active {
  transform: rotate(0deg);
}
</style>