# Barbers
This simple system aims to implement a waiting queue for Barber's based on WeChat APIs.

# Structure
`barbers_server.js`是服务端主程序

`package.json`保存了项目使用的第三方包

`/lib`目录包含了服务端引用的扩展函数

`/public`目录含有客户端网页，样式表，，图片，脚本文件

`/test`目录包含对`/lib`中扩展函数的单元测试

## barbers_server.js
barbers_server.js由两个部分组成：对WeChat API的响应部分与对浏览器访问的响应部分。

浏览器访问响应包括了静态HTML表单下发以及针对浏览器上socket.io链接响应

静态表单下发由Express框架响应GET请求
静态表单中包含用户WeChat openid。使用ejs进行表单渲染，把openid放入隐藏p标签中
