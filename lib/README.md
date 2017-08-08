# Barbers/lib
包含所有服务端的扩展函数
## socket_server.js
socket.io链接由socket.io事件响应部分组成

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

4. 浏览器发出'removeCustomer'事件，向服务端请求删除顾客

 --> 服务端侦听'removeCustomer'事件，根据openid删除顾客，发出'operationResult'事件

 --> 浏览器侦听'operationResult'事件，把结果返回给用户

5. 服务器发出'queueUpdate'事件，提示客户端更新

 --> 浏览器侦听'queueUpdate'事件，触发发送'monitorQueue'事件

6. 浏览器发出'moveCustomerInQueue'事件，向服务端请求移动顾客

 --> 服务端侦听'moveCustomerInQueue'事件，根据openid和delta移动顾客，发出'operationResult'事件

 --> 浏览器侦听'operationResult'事件，把结果返回给用户

## barber_queue.js
queue记录当前排队的顾客（以customer对象保存在内存中）
### Future Expectations
standing_queue对象以barber_name为key，顾客队列为value. 顾客队列是以customer对象为元素的数组

barber_processing对象以barber_name为key，顾客队列为value，记录正在理发的顾客. 顾客队列是以customer对象为元素的数组
### 对象结构: customer
Customer是用以保存用户信息的对象. 每一个用户唯一对应一个Customer对象

Customer对象以微信openid唯一识别

Customer对象结构:
// TODO: change queue to a JSON object. Use openid as key.
```
{
  name:              -- Name of the customer (Optional)  用户（真实？）姓名
  nickname:          -- (Optional)   微信昵称
  openid:            -- WeChat OpenID (Required) 微信Openid
  tel:               -- Customer telephone number (Optional) 用户（真实？）电话／联系方式
  serviceType:       -- (Required)
  estimatedTime:     -- (Optional)
  sex:               -- (Optional)   用户（真实？）性别
}
```
## weChatAPI.js
实现WeChat API
## service_list.js
提供服务类型查询、本地化
## anweringMachine.js
应答给定文字输入，实现文字交互排队
