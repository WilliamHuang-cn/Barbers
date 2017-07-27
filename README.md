# Barbers
This simple system aims to implement a waiting queue for Barber's based on WeChat APIs.

# Structure
barbers_server.js由两个部分组成：对WeChat API的响应部分与对浏览器访问的响应部分。

浏览器访问响应包括了静态HTML表单下发以及针对浏览器上socket.io链接响应

静态表单下发由Express框架响应GET请求
静态表单中需包含用户WeChat openid（待实现）

socket.io链接由socket.io事件响应部分(register_server.js)组成
socket.io事件表：
1. 浏览器发出'registerInfo'事件，向服务端请求服务信息（待实现）
 --> 服务端侦听'registerInfo'事件，发出'serviceTypes'事件把服务信息交给浏览器（待实现）
 --> 浏览器侦听'serviceTypes'事件，将服务信息转换为选项（待实现）
2. 浏览器发出'joinQueue'事件，在option中描述用户姓名，电话，服务类型等信息
 --> 服务端侦听'joinQueue'事件，把用户加入队列中，发出'joinResult'事件，返回加入结果
 --> 浏览器侦听'joinResult'事件，把结果反馈给用户
3. 浏览器发出'monitorQueue'事件，向服务端请求队列信息
 --> 服务端侦听'monitorQueue'事件，发出'queueInfo'事件，返回队列信息
 --> 浏览器侦听'queueInfo'事件，把队列显示给用户
