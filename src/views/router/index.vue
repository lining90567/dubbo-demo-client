<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <router-edit ref="routerEdit" :parentRouterList="parentRouterList" v-on:save-finished="getRouterList()"></router-edit>
      <el-row class="search-row">
        <el-col :span="12">
          <el-input placeholder="路由名称" size="small" v-model="search.name">
            <el-button slot="append" icon="el-icon-search" @click="getRouterList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button type="primary" icon="el-icon-plus" size="small" 
            v-show="permission.add" @click="handleCreateRouter()">添加</el-button>
        </el-col>        
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="routerList" border size="mini" header-cell-class-name="header-row">
            <el-table-column prop="name" label="名称" header-align="center"></el-table-column>
            <el-table-column prop="code" label="代码" header-align="center"></el-table-column>         
            <el-table-column prop="url" label="url" header-align="center"></el-table-column>
            <el-table-column prop="level" label="层级" header-align="center" align="center"></el-table-column>
            <el-table-column prop="displayOrder" label="显示序号" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center" width="200">
              <template slot-scope="scope">
                <el-button v-show="permission.edit" type="primary" size="mini"
                  @click="handleEditRouter(scope.$index, scope.row)">编辑</el-button>           
                <el-button v-show="permission.remove" type="danger" size="mini"
                  @click="handleDeleteRouter(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>              
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-pagination
            background     
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[5, 10, 20]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="routerTotal">
          </el-pagination>     
        </el-col>
      </el-row>       
    </el-col>
  </el-row>
</template>

<script>
import { listRouter, getRouterById, listByParentId, removeRouter } from '@/api/router'
import { listResourcePermission } from "@/api/resource"
import RouterEdit from "@/components/router/routerEdit"

export default {
  data() {
    return {
      loading: false,
      permission: {
        add: false,
        edit: false,
        remove: false
      },      
      search: {
        name: '',
        offset: 0,
        limit: 10
      },
      routerTotal: 0,
      routerList: [],
      parentRouterList: []
    }
  },
  methods: {
    getRouterList() {
      this.loading = true
      listRouter(this.search)
      .then(response => {
        this.routerTotal = response.data.total
        this.routerList = response.data.rows
        this.loading = false
      })
      .catch(error => {
        this.outputError(error)
      })
    },
    handleSizeChange(val) {
      this.search.limit = val;
      this.search.offset = (this.search.currentPage - 1) * val
      this.getRouterList()
    },
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit
      this.search.currentPage = val
      this.getRouterList()
    },    
    async pageInit() {
      this.loading = true
      try {
        let [listRouterResp, listPermissionResp] = await Promise.all([
          listRouter(this.search),
          listResourcePermission(this.$route.meta.routerId)
        ])
        this.routerTotal = listRouterResp.data.total
        this.routerList = listRouterResp.data.rows
        this.permission.add = listPermissionResp.data.find(item => {
          return item.resourcePermission === "routers:create"
        })
        this.permission.edit = listPermissionResp.data.find(item => {
          return item.resourcePermission === "routers:update"
        })
        this.permission.remove = listPermissionResp.data.find(item => {
          return item.resourcePermission === "routers:delete"
        })
        this.loading = false      
      } catch(error) {
        this.outputError(error)        
      }
    },
    handleCreateRouter() {
      this.loading = true
      listByParentId(0)
      .then(response => {
        this.parentRouterList = this.getParentRouterList(response.data)
        this.loading = false
        this.$refs.routerEdit.$emit('openAddRouterDialog')
      })
      .catch(error => {
        this.outputError(error)         
      })
    },    
    async handleEditRouter(index, row) {
      this.loading = true
      try {
        let [getRouterResp, listRootRouterResp] = await Promise.all([
          getRouterById(row.id),
          listByParentId(0)
        ])
        this.parentRouterList = this.getParentRouterList(listRootRouterResp.data)
        this.$refs.routerEdit.$emit('openEditRouterDialog', getRouterResp.data)
        this.loading = false   
      } catch(error) {
        this.outputError(error)        
      }
    },
    handleDeleteRouter(index, row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.loading = true
        removeRouter(row.id)
        .then(response => {
          this.loading = false
          this.getRouterList()
        })
        .catch(error => {
          this.outputError(error)          
        })
      })
      .catch(() => {})
    },
    getParentRouterList(routers) {
      let result = []
      result.push(
        {
          id: 0,
          name: '无'
        }
      )
      for(let router of routers) {
        result.push({
          id: router.id,
          name: router.name
        })
      }
      return result
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
  components: { RouterEdit },
  created() {
    this.pageInit()
  }
}
</script>

<style lang="scss" scoped>
.search-row {
  padding-bottom: 8px;
  .el-input {
    width: 260px;
  }
}

.router-locked {
  color: red;
}
.router-not-locked {
  color: green;
}
</style>
        