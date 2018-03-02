<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <role-edit ref="roleEdit" v-on:save-finished="getRoleList()"></role-edit>
      <role-permission ref="rolePermission"></role-permission>
      <el-row class="search-row">
        <el-col :span="12">
          <el-input placeholder="角色名称" size="small" v-model="search.name">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button type="primary" icon="el-icon-plus" size="small" 
            v-show="permission.add" @click="handleCreateRole()">添加</el-button>
        </el-col>        
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="roleList" border size="mini" header-cell-class-name="header-row">
            <el-table-column prop="name" label="名称" header-align="center"></el-table-column>
            <el-table-column prop="code" label="代码" header-align="center"></el-table-column>         
            <el-table-column prop="locked" label="状态" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-bind:class="{ 'role-locked': scope.row.locked, 'role-not-locked': !scope.row.locked }">{{ scope.row.locked ? "禁用" : "可用" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" align="center" width="260">
              <template slot-scope="scope">
                <el-button v-show="permission.edit" type="primary" size="mini"
                  @click="handleEditRole(scope.$index, scope.row)">编辑</el-button>
                <el-button v-show="permission.edit" type="primary" size="mini"
                  @click="handleSetPermission(scope.$index, scope.row)">权限设置</el-button>                              
                <el-button v-show="permission.remove" type="danger" size="mini"
                  @click="handleDeleteRole(scope.$index, scope.row)">删除</el-button>
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
            :total="roleTotal">
          </el-pagination>     
        </el-col>
      </el-row>       
    </el-col>
  </el-row>
</template>

<script>
import { listRole, getRoleById, removeRole } from '@/api/role'
import { listResourcePermission } from "@/api/resource"
import RoleEdit from "@/components/role/roleEdit"
import RolePermission from "@/components/role/rolePermission"

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
      roleTotal: 0,
      roleList: []
    }
  },
  methods: {
    getRoleList() {
      this.loading = true
      listRole(this.search)
      .then(response => {
        this.roleTotal = response.data.total
        this.roleList = response.data.rows
        this.loading = false
      })
      .catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.search.limit = val;
      this.search.offset = (this.search.currentPage - 1) * val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit
      this.search.currentPage = val
      this.getRoleList()
    },    
    async pageInit() {
      this.loading = true
      try {
        let [listRoleResp, listPermissionResp] = await Promise.all([
          listRole(this.search),
          listResourcePermission(this.$route.meta.routerId)
        ])
        this.roleTotal = listRoleResp.data.total
        this.roleList = listRoleResp.data.rows
        this.permission.add = listPermissionResp.data.find(item => {
          return item.resourcePermission === "roles:create"
        })
        this.permission.edit = listPermissionResp.data.find(item => {
          return item.resourcePermission === "roles:update"
        })
        this.permission.remove = listPermissionResp.data.find(item => {
          return item.resourcePermission === "roles:delete"
        })
        this.loading = false           
      } catch(error) {
        this.outputError(error)        
      }
    },
    handleCreateRole() {
      this.$refs.roleEdit.$emit('openAddRoleDialog')
    },    
    handleEditRole(index, row) {
      this.loading = true
      getRoleById(row.id)
      .then(response => {
        this.$refs.roleEdit.$emit('openEditRoleDialog', response.data)
        this.loading = false  
      })
      .catch(error => {
        this.outputError(error)       
      })
    },
    handleDeleteRole(index, row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.loading = true
        removeRole(row.id)
        .then(response => {
          this.loading = false
          this.getRoleList()
        })
        .catch(error => {
          this.outputError(error)           
        })
      })
      .catch(() => {})
    },
    handleSetPermission(index, row) {
      this.$refs.rolePermission.$emit('openSetPermissionDialog', row)
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
  components: { RoleEdit, RolePermission },
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

.role-locked {
  color: red;
}
.role-not-locked {
  color: green;
}
</style>