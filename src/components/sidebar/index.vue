<template>
  <el-menu class="nav-menu" background-color="#223233" text-color="#fff" active-text-color="#13A1FF" 
        :default-openeds="['1']" unique-opened="unique-opened" :collapse="isCollapse">
    <template v-for="router in routers" v-if="router.level == 1">
      <el-submenu :index="router.id + ''">
        <template slot="title">
          <i :class="router.cssClass"></i>
          <span slot="title">{{ router.name }}</span>
        </template>
        <template v-for="childRouter in routers" v-if="childRouter.parentId == router.id">
          <router-link :to="childRouter.url" :key="childRouter.name">
            <el-menu-item :index="router.id + '-' + childRouter.id">
              <template slot="title">
                <i :class="childRouter.cssClass"></i>
                <span>{{ childRouter.name }}</span>              
              </template>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
export default {
  name: 'sidebar',
  props: ['isCollapse', 'routers']
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
