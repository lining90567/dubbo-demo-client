<template>
  <el-dialog :title="dialogProps.title" :visible.sync="dialogProps.visible" width="560px" 
    @open="handleDialogOpen()" v-loading="loading">
    <div slot="title" class="dialog-header">{{ dialogProps.title }}</div>
    <el-form :model="userModel" :rules="dialogProps.action === 'add' ? addRules : editRules" 
      ref="userForm" label-width="80px" label-position="right" size="small">
      <el-tabs type="border-card" v-model="activeTabName">
        <el-tab-pane name="userInfoTab" label="基本信息" class="user-info-tab-pane">
          <el-form-item label="用户名" prop="name">
            <el-col :span="16"><el-input ref="username" :maxlength="32" v-model="userModel.name" autofocus></el-input></el-col>
          </el-form-item>
          <el-form-item label="登录名" prop="loginName">
            <el-col :span="16"><el-input :maxlength="32" v-model="userModel.loginName"></el-input></el-col>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-show="dialogProps.action === 'add'">
            <el-col :span="16">
              <el-input type="password" :maxlength="32" v-model="userModel.password" auto-complete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword" v-show="dialogProps.action === 'add'">
            <el-col :span="16">
              <el-input type="password" :maxlength="32" v-model="userModel.checkPassword" auto-complete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="禁用">
            <el-switch v-model="userModel.locked"></el-switch>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="角色设置">
          <el-checkbox :indeterminate="roleCheckboxList.isIndeterminate" v-model="roleCheckboxList.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userModel.roleIds" @change="handleCheckedRolesChange">
            <el-checkbox v-for="role in roleCheckboxList.roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>           
        </el-tab-pane>
      </el-tabs>     
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleDialogClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm('userForm')">确 定</el-button>
    </span>    
  </el-dialog>
</template>

<script>
import { saveUser, updateUser } from '@/api/user'

export default {
  name: "user-edit",
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'));
      } else {
        if (this.userModel.checkPassword !== '') {
          this.$refs.userForm.validateField('checkPassword');
        }
        callback()
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userModel.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      userModel: {
        id: 0,
        name: '',
        loginName: '',
        password: '',
        locked: false,
        roleIds: []
      },
      roleCheckboxList: {
        checkAll: false,
        isIndeterminate: true,
        roles: []
      },
      dialogProps: {
        visible: false,
        action: '',
        title: ''
      },
      activeTabName: 'userInfoTab',
      addRules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateCheckPassword, trigger: 'blur' }
        ]
      },
      editRules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.dialogProps.action === 'add') {
            this.doSaveUser()
          } else {
            this.doUpdateUser()
          }
        } else {
          return false
        }
      })
    },
    doUpdateUser() {
      this.loading = true
      updateUser(this.userModel.id, this.userModel)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
        this.$emit('save-finished')
      })
      .catch(error => {
        this.outputError(error)      
      })
    },
    doSaveUser() {
      this.loading = true
      saveUser(this.userModel)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
        this.$emit('save-finished')
      })
      .catch(error => {
        this.outputError(error) 
      })
    },    
    handleDialogClose() {
      this.dialogProps.visible = false  
    },
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
        this.$refs['username'].focus()
      })
    },
    getAllRoleId() {
      let allRoleId = []
      for(let role of this.roleCheckboxList.roles) {
        allRoleId.push(role.id)
      }
      return allRoleId
    },
    handleCheckAllChange(val) {
      this.userModel.roleIds = (val ? this.getAllRoleId() : [])
      this.roleCheckboxList.isIndeterminate = false
    },
    handleCheckedRolesChange(value) {
      let checkedCount = value.length
      this.roleCheckboxList.checkAll = checkedCount === this.roleCheckboxList.roles.length
      this.roleCheckboxList.isIndeterminate = checkedCount > 0 && checkedCount < this.roleCheckboxList.roles.length
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
      this.$on('openEditUserDialog', function(user, roles) {
        this.userModel = user
        this.roleCheckboxList.roles = roles        
        this.dialogProps.action = 'edit'
        this.dialogProps.title = '修改用户'
        this.activeTabName = 'userInfoTab'
        this.dialogProps.visible = true
      })
      this.$on('openAddUserDialog', function(roles) {
        this.userModel = {
          roleIds: []
        }
        this.roleCheckboxList.roles = roles
        this.dialogProps.action = 'add'
        this.dialogProps.title = '添加用户'
        this.activeTabName = 'userInfoTab'
        this.dialogProps.visible = true
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .user-info-tab-pane {
    margin-top: 10px;
  }
</style>





