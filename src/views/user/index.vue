<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <user-edit ref="userEdit" v-on:save-finished="searchUser"></user-edit>
      <change-password ref="changePassword"></change-password>
      <el-row class="search-row">
        <el-col :span="12">
          <el-input placeholder="用户名" size="small" v-model="search.username">
            <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-button type="primary" icon="el-icon-plus" size="small" 
            v-show="permission.add" @click="handleCreateUser()">添加</el-button>
        </el-col>        
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="userList" border size="mini" header-cell-class-name="header-row">
            <el-table-column prop="name" label="用户名" header-align="center"></el-table-column>
            <el-table-column prop="loginName" label="登录名" header-align="center"></el-table-column>
            <el-table-column prop="locked" label="状态" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-bind:class="{ 'user-locked': scope.row.locked, 'user-not-locked': !scope.row.locked }">{{ scope.row.locked ? "禁用" : "可用" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center" width="260">
              <template slot-scope="scope">
                <el-button v-show="permission.edit" type="primary" size="mini"
                  @click="handleEditUser(scope.$index, scope.row)">编辑</el-button>
                <el-button v-show="permission.edit" type="primary" size="mini"
                  @click="handleChangePassword(scope.$index, scope.row)">修改密码</el-button>             
                <el-button v-show="permission.remove" type="danger" size="mini"
                  @click="handleDeleteUser(scope.$index, scope.row)">删除</el-button>
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
            :total="userTotal">
          </el-pagination>     
        </el-col>
      </el-row>    
    </el-col>
  </el-row>
</template>

<script>
import UserEdit from '@/components/user/userEdit'
import ChangePassword from '@/components/user/changePassword'
import { listUser, getUser, removeUser, listUserRole } from '@/api/user'
import { listResourcePermission } from '@/api/resource'
import { listAllRole } from '@/api/role'

export default {
  data() {
    return {
      userList: [],
      permission: {
        add: false,
        edit: false,
        remove: false
      },
      userTotal: 0,
      search: {
        username: "",
        sort: "",
        offset: 0,
        limit: 10,
        currentPage: 1
      },
      loading: true    
    };
  },
  methods: {
    searchUser() {
      this.loading = true
      listUser(this.search)
      .then(response => {
        this.userList = response.data.rows
        this.userTotal = response.data.total
        this.loading = false
      })
      .catch(error => {
        this.outputError(error)
      })
    },
    handleSizeChange(val) {
      this.search.limit = val;
      this.search.offset = (this.search.currentPage - 1) * val
      this.searchUser()
    },
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit
      this.search.currentPage = val
      this.searchUser()
    },
    async handleCreateUser() {
      this.loading = true
      try {
        let [allRoleResp] = await Promise.all([
          listAllRole()
        ])
        this.$refs.userEdit.$emit('openAddUserDialog', allRoleResp.data)
        this.loading = false
      } catch(error) {
        this.outputError(error)        
      }      
    },
    async handleEditUser(index, row) {
      this.loading = true
      try {
        let [userResp, allRoleResp, userRoleResp] = await Promise.all([
          getUser(row.id),
          listAllRole()
        ])
        this.$refs.userEdit.$emit('openEditUserDialog', userResp.data, allRoleResp.data)
        this.loading = false
      } catch(error) {
        this.outputError(error)       
      }
    },
    handleChangePassword(index, row) {
      this.loading = true
      getUser(row.id)
      .then(response => {
        this.$refs.changePassword.$emit('openChangePasswordDialog', response.data)
        this.loading = false
      })
      .catch(error => {
        this.outputError(error)        
      })
    },    
    handleDeleteUser(index, row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        this.loading = true       
        removeUser(row.id)
        .then(response => {
          this.loading = false
          this.searchUser()
        })
        .catch(error => {
          this.outputError(error)                
        })
      })
      .catch(() => {})
    },
    async pageInit() {
      this.loading = true
      try {
        let [searchUserResp, getPermissionResp] = await Promise.all([
          listUser(this.search),
          listResourcePermission(this.$route.meta.routerId)
        ])
        this.userList = searchUserResp.data.rows
        this.userTotal = searchUserResp.data.total
        this.permission.add = getPermissionResp.data.find(item => {
          return item.resourcePermission === "users:create"
        })
        this.permission.edit = getPermissionResp.data.find(item => {
          return item.resourcePermission === "users:update"
        })
        this.permission.remove = getPermissionResp.data.find(item => {
          return item.resourcePermission === "users:delete"
        })
        this.loading = false
      } catch(error) {
        this.outputError(error)        
      }        
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
  components: { UserEdit, ChangePassword },
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

.user-locked {
  color: red;
}
.user-not-locked {
  color: green;
}
</style>

