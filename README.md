# Dubbo-Demo-Client

------

Dubbo-Demo-Client是基于vue+element开发的Dubbo-Demo项目的前端应用，包含了如下功能特点：

> * Vue+Element，轻巧、高性能、易于上手。
> * 后台Web应用无状态，使用JWT管理身份认证。
> * 动态路由，按需加载。

![登录](https://github.com/lining90567/dubbo-demo-client/blob/master/screenshots/login.png)

![首页](https://github.com/lining90567/dubbo-demo-client/blob/master/screenshots/index.png)

![路由](https://github.com/lining90567/dubbo-demo-client/blob/master/screenshots/router.png)

![资源](https://github.com/lining90567/dubbo-demo-client/blob/master/screenshots/resource.png)

![权限](https://github.com/lining90567/dubbo-demo-client/blob/master/screenshots/permission.png)

![用户](https://github.com/lining90567/dubbo-demo-client/blob/master/screenshots/user.png)

## 使用方法

### 修改配置文件

config\dev.env.js和prod.env.js，修改BASE_API为 [dubbo-demo-backend](https://github.com/lining90567/dubbo-demo-server/tree/master/dubbo-demo-backend) 的地址。

### 运行

 - 安装依赖包：npm（建议使用cnpm） install
 - npm run dev，通过http://localhost:3000 访问
 - npm run build，完成后打开dist\index.html访问

**作者信息**

博客：[http://blog.csdn.net/hyxhbj1](http://blog.csdn.net/hyxhbj1)

邮箱：lining90567@sina.com

QQ：328616209