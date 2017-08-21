##了解Jingle##

Jingle是一个SPA(Single Page Application)开发框架，用来开发移动端的html5应用，在体验上尽量去靠近native应用，试图能够与native应用相媲美 `(*∩_∩*)′(虽然现在看来还相距甚远)。

- 支持国内主流移动端浏览器，如safari, chrome, UC, qq等
- 提供大量简单易用的ui组件
- 不绑定页面样式，可随意自行设计
- 前端模板渲染

##Jingle结构##
section: 

- 卡片式结构，一个section对应一个卡片(相当于android里的activity)
- 按需加载section模板
- sectionId与hash 一 一 对应
 
article:

- 相当于android里的fragment
- 根据header footer自动充满屏幕

header:

- 固定在屏幕顶部

footer

- 固定在屏幕底部

popup toast

- 同时只会有一个实例存在

##Jingle适合开发什么样的应用##

- 基于phonegap、Appcan等移动中间件开发的Hybrid应用
- 轻应用
- ...

服务端 + RestAPI(JSON) + 客户端(Jingle)模式开发


*Jinlge还是一个不完善的框架，正在努力完善中...*



