# 系统环境 unbantu

# 通过 sudo apt-get install nodejs-legacy -y 安装 nodejs
# 通过 sudo apt-get install npm -y 安装 npm 包管理器
```
~ sudo apt-get install nodejs-legacy -y
~ sudo apt-get install npm -y

~ node -v


~ npm -v

```

<img src='https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/2.png'>

# 创建工作目录
```
~ mkdir workspace
~ mkdir workspace/nodejs
~ cd workspace/nodejs
~ pwd
/home/Ken/workspace/nodejs
```
<img src='https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/3.png'>

# 全局安装 expres 
```
sudo npm install express -g
```

<img src='https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/4.png'>

# 先全局安装 node-express-generator
```
sudo apt-get install node-express-generator -y
```
<img src='https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/5.png'>

# 使用 express 生成项目
```
express -e nodejs-demo
```
<img src="https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/6.png">


# 切换到 nodejs-demo 目录
```
cd nodejs-demo

```
<img src="https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/7.png">

# 启动项目
```
执行  npm install 安装完依赖包后 执行 node ./bin/www
```
<img src="https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/8.png">


# 最后浏览效果
```
在浏览器的地址栏输入
localhost:3000
```
<img src="https://github.com/KenNaNa/koa_learning/blob/master/ubantu_nodejs/1.png">
