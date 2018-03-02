<template>
  <el-dialog :title="dialogProps.title" :visible.sync="dialogProps.visible" width="500px" 
    v-loading="loading">
    <div slot="title" class="dialog-header">{{ dialogProps.title }}</div>
    <el-row :gutter="15">
      <el-col :span="24">
        <div class="permission-container">
          <el-tree ref="permissionTree" :data="permissionTreeNodes" show-checkbox 
            :props="treeProps" :highlight-current=true :default-expand-all=true node-key="key"
            :default-checked-keys="permissionKeys"></el-tree>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleDialogClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="doSavePermission()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listAllRouter } from '@/api/router'
import { listAvailableResource } from '@/api/resource'
import { listResourcePermission, savePermission } from '@/api/role'

export default {
  name: 'role-permission',
  data() {
    return {
      loading: false,
      treeProps: {
        children: "children",
        label: "name"
      },
      permissionTreeNodes: [],
      permissionKeys: [],
      role: {
        id: 0,
        name: ''
      },
      dialogProps: {
        visible: false,
        title: ''
      }
    }
  },
  methods: {
    handleDialogClose() {
      this.dialogProps.visible = false  
    },
    async componentInit(role) {
      this.loading = true
      this.role = role
      this.dialogProps.title = '权限设置 - ' + this.role.name
      this.permissionKeys = []

      try {
        let [listRouterResp, listResourceResp, listPermissionResp] = await Promise.all([ 
          listAllRouter(false),
          listAvailableResource(),
          listResourcePermission(role.id)
        ])
        let treeNodes = []
        for(let router of listRouterResp.data) {
          if(router.parentId == 0) {
            let treeNode = {
              type: 'router',
              id: router.id,
              name: router.name,
              children: []
            }
            this.getPermissionChildNode(listRouterResp.data, treeNode, 
              listResourceResp.data, listPermissionResp.data)
            treeNodes.push(treeNode)
          }
        }
        this.permissionTreeNodes = treeNodes

        listPermissionResp.data.forEach(element => {
          this.permissionKeys.push('resource-' + element)
        })

        this.loading = false
        this.dialogProps.visible = true
      } catch(error) {
        this.outputError(error)
      }
    },
    getPermissionChildNode(allRouter, parentNode, availableResource, permission) {
      for(let router of allRouter) {
        if(router.parentId == parentNode.id) {
          let childNode = {
            type: 'router',
            id: router.id,
            name: router.name,
            children: []
          }
          availableResource.forEach(element => {
            if(element.routerId == router.id) {
              let resourceNode = {
                type: 'resource',
                id: element.id,
                name: element.name,
                key: 'resource-' + element.id
              }
              childNode.children.push(resourceNode)
            }
          })
          parentNode.children.push(childNode)
          this.getPermissionChildNode(allRouter, childNode)
        }
      }
    },
    doSavePermission() {
      this.loading = true
      let routerIds = []
      let resourceIds = []
      this.$refs.permissionTree.getCheckedNodes().forEach(element => {
        if(element.type === 'router') {
          routerIds.push(element.id)
        }
        if(element.type === 'resource') {
          resourceIds.push(element.id)
        }
      })
      this.$refs.permissionTree.getHalfCheckedNodes().forEach(element => {
        if(element.type === 'router') {
          routerIds.push(element.id)
        }
        if(element.type === 'resource') {
          resourceIds.push(element.id)
        }
      })

      let permission = {
        routerIds: routerIds,
        resourceIds: resourceIds
      }
      savePermission(this.role.id, permission)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
      })
      .catch(error => {
        this.outputError(error)
      })
    },
    outputError(error) {
      console.log(error.response ? error.response : error.message)
      this.loading = false
      this.$message({
        showClose: true,
        message: '出错了，请按F12查看浏览器日志。',
        type: 'error'
      })      
    }
  },
  mounted: function() {
    this.$nextTick(() => {  
      this.$on('openSetPermissionDialog', function(role) {
        this.componentInit(role);
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .permission-container {
    margin-top: -8px;
    height: 360px;
    overflow-y: auto;
  }
</style>


