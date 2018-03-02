<template>
  <el-dialog title="个人信息" :visible.sync="dialogVisible" width="560px" 
    @open="handleDialogOpen()" v-loading="loading">
    <div slot="title" class="dialog-header">个人信息</div>
    <el-form :model="userModel" :rules="rules" 
      ref="personalInfoForm" label-width="80px" label-position="right" size="small">
      <el-form-item label="用户名" prop="name">
        <el-col :span="16"><el-input ref="username" :maxlength="32" v-model="userModel.name" autofocus></el-input></el-col>
      </el-form-item>
      <el-form-item label="登录名" prop="loginName">
        <el-col :span="16"><el-input :maxlength="32" v-model="userModel.loginName"></el-input></el-col>
      </el-form-item>
      <el-form-item><el-checkbox v-model="changePassword" @change="handleChangePasswordChanged">修改密码</el-checkbox></el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="16">
          <el-input type="password" ref="password" :disabled="!changePassword" v-model="userModel.password" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-col :span="16">
          <el-input type="password" v-model="userModel.checkPassword" :disabled="!changePassword" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>        
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleDialogClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm('personalInfoForm')">确 定</el-button>
    </span>    
  </el-dialog>
</template>

<script>
import { getCurrentUser, updateCurrentUser } from '@/api/user'

export default {
  name: "personal-info",
  data() {
    var validatePassword = (rule, value, callback) => {
      if (this.changePassword && (value === '' || value === undefined)) {
        callback(new Error('请输入密码'));
      } else {
        if (this.userModel.checkPassword !== '') {
          this.$refs.personalInfoForm.validateField('checkPassword');
        }
        callback()
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      if (this.changePassword && (value === '' || value === undefined)) {
        callback(new Error('请再次输入密码'))
      } else if (this.changePassword && (value !== this.userModel.password)) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      changePassword: false,
      userModel: {
        id: 0,
        name: '',
        loginName: ''
      },
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],          
        password: [
          { required: this.changePassword, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: this.changePassword, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateCheckPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.doUpdatePersonalInfo()
        } else {
          return false;
        }
      })
    },
    doUpdatePersonalInfo() {
      this.loading = true
      if(!this.changePassword) {
          this.userModel.password = ''
      }
      updateCurrentUser(this.userModel)
      .then(response => {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
        currentUser.name = this.userModel.name
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
        this.$emit('username-changed')
        this.changePassword = false
        this.loading = false
        this.dialogVisible = false
      })
      .catch(error => {
        this.outputError(error)     
      })
    },  
    handleDialogClose() {
      this.dialogVisible = false  
    },
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['personalInfoForm'].clearValidate()
        this.$refs['username'].focus()
      })
    },
    handleChangePasswordChanged(val) {
      this.$refs['personalInfoForm'].clearValidate()
      if(val) {
        this.$nextTick(() => {
            this.$refs['password'].focus()
        })
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
  mounted: function() {
    this.$nextTick(() => {
      this.$on('openPersonalInfoDialog', function() {
        this.loading = true
        this.changePassword = false
        getCurrentUser()
        .then(response => {
          this.userModel = response.data
          this.userModel.password = ''
          this.dialogVisible = true
        })
        .catch(error => {
          this.outputError(error)
        })
      })
    })
  }
}
</script>

<style lang="scss">
.el-dialog {
  text-align: left;
}
.dialog-header {
  width: 100%;
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: solid 1px #eee;
}
</style>



