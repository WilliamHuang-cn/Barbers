# Barbers
This simple system aims to implement a waiting queue for Barber's based on WeChat APIs.

# Structure
`barbers_server.js`是服务端主程序

`package.json`保存了项目使用的第三方包

`/lib`目录包含了服务端引用的扩展函数

`/public`目录含有客户端网页，样式表，，图片，脚本文件

`/test`目录包含对`/lib`中扩展函数的单元测试

## barbers_server.js
barbers_server.js由两个部分组成：对WeChat API的响应部分与对浏览器访问的响应部分.

浏览器访问响应包括了静态HTML表单下发以及针对浏览器上socket.io链接响应（由socket_server.js处理）

静态表单下发由Express框架响应GET请求
静态表单中包含用户WeChat openid. 使用ejs进行表单渲染，把openid与跳转链接放入隐藏p标签中

## Route Mapping路由规划
### host/
* POST请求
接受微信客户端消息与事件推送。消息转由answeringMachine.js处理回复
### host/register
* GET请求
返回经过渲染的register.ejs，把openid放入隐藏p标签中，并加入服务类型选项（待实现）
### host/monitor
* GET请求
返回queue_monitor.html
