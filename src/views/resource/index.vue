<template>
  <el-container v-loading="loading">
    <el-aside width="200px">
      <el-tree :data="routerTreeNodes" :props="defaultProps" :highlight-current=true :default-expand-all=true @node-click="handleNodeClick"></el-tree>
    </el-aside>
    <el-main>
      <el-row class="function-button-row">
        <el-col :span="24" style="text-align: right;">
          <el-button type="primary" icon="el-icon-plus" size="small" 
            v-show="permission.add" @click="handleCreateResource()">添加</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <resource-edit ref="resourceEdit" v-on:save-finished="listResource"></resource-edit>
          <el-table :data="resourceList" border size="mini" header-cell-class-name="header-row">
            <el-table-column prop="name" label="资源名称" header-align="center"></el-table-column>
            <el-table-column prop="code" label="资源代码" header-align="center"></el-table-column>
            <el-table-column prop="url" label="Url" header-align="center"></el-table-column>
            <el-table-column prop="permission" label="权限代码" header-align="center"></el-table-column>
            <el-table-column prop="locked" label="状态" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-bind:class="{ 'data-locked': scope.row.locked, 'data-not-locked': !scope.row.locked }">{{ scope.row.locked ? "禁用" : "可用" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" align="center" width="200">
              <template slot-scope="scope">
                <el-button v-show="permission.edit" type="primary" size="mini"
                  @click="handleEditResource(scope.$index, scope.row)">编辑</el-button>           
                <el-button v-show="permission.remove" type="danger" size="mini"
                  @click="handleDeleteResource(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>                       
          </el-table>
        </el-col>
      </el-row>  
    </el-main>
  </el-container>
</template>

<script>
import { listAllRouter } from '@/api/router'
import { listResource, getResourceById, removeResource, listResourcePermission } from '@/api/resource'
import ResourceEdit from '@/components/resource/resourceEdit'

export default {
  data() {
    return {
      routerTreeNodes: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      permission: {
        add: false,
        edit: false,
        remove: false
      },
      currentRouter: {
        id: 0,
        name: ''
      },
      resourceList: [],
      loading: true
    }
  },
  methods: {
    handleNodeClick(data) {
      this.currentRouter.id = data.id
      this.currentRouter.name = data.name
      this.listResource()
    },
    listResource() {
      this.loading = true
      listResource(this.currentRouter.id)
      .then(response => {
        this.resourceList = response.data
        this.loading = false
      })
      .catch(error => {
        this.outputError(error)       
      })
    },
    getTreeNodeChildren(allRouter, parentNode) {
      for(let router of allRouter) {
        if(router.parentId == parentNode.id) {
          let childNode = {
            id: router.id,
            name: router.name,
            children: []
          }
          parentNode.children.push(childNode)
          this.getTreeNodeChildren(allRouter, childNode)
        }
      }
    },
    async pageInit() {
      try {
        let [listAllRouterResp, listPermissionResp] = await Promise.all([ 
          listAllRouter(false),
          listResourcePermission(this.$route.meta.routerId)
        ])

        let nodes = []
        for(let router of listAllRouterResp.data) {
          if(router.parentId == 0) {
            let treeNode = {
              id: router.id,
              name: router.name,
              children: []
            }
            this.getTreeNodeChildren(listAllRouterResp.data, treeNode)
            nodes.push(treeNode)
          }
        }
        this.routerTreeNodes = nodes
        this.permission.add = listPermissionResp.data.find(item => {
          return item.resourcePermission === "resources:create"
        })
        this.permission.edit = listPermissionResp.data.find(item => {
          return item.resourcePermission === "resources:update"
        })
        this.permission.remove = listPermissionResp.data.find(item => {
          return item.resourcePermission === "resources:delete"
        })
        this.loading = false
      } catch(error) {
        this.outputError(error)
      }
    },
    handleCreateResource() {
      if(this.currentRouter.id == 0) {
        this.$message({
          showClose: true,
          message: '请选择路由！',
          type: 'error'
        })
        return      
      }
      this.$refs.resourceEdit.$emit('openAddResourceDialog', this.currentRouter)     
    },
    handleEditResource(index, row) {
      this.loading = true
      getResourceById(row.id)
      .then(response => {
        this.$refs.resourceEdit.$emit('openEditResourceDialog', response.data)
        this.loading = false        
      })
      .catch(error => {
        this.outputError(error)        
      })
    },
    handleDeleteResource(index, row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.loading = true       
        removeResource(row.id)
        .then(response => {
          this.loading = false
          this.listResource()
        })
        .catch(error => {
          this.outputError(error)                
        })
      })
      .catch(() => {})
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
  components: { ResourceEdit },
  created() {
    this.pageInit()
  }
}
</script>

<style lang="scss" scoped>
.router-container {
  width: 100px;
  font: bold;
}

.el-main {
  padding-top: 5px;
}

.function-button-row {
  padding-bottom: 8px;
}

.data-locked {
  color: red;
}
.data-not-locked {
  color: green;
}
</style>
