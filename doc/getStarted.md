#怎么使用Jingle#

##下载Jingle##
源码都在github上，直接从github下载。
主要包含：

1. Jingle组件

2. Jingle css

3. 依赖的js框架(zepto\template\iscroll)


默认Jingle组件已经打包好放在dist文件夹中，用户可以根据需要修改src中的源码后通过grunt重新进行打包

##代码结构##
css:
	
	<link rel="stylesheet" href="css/Jingle.css">

javascript:

	<script type="text/javascript" src="js/lib/zepto.js"></script>
	<script type="text/javascript" src="js/lib/iscroll.js"></script>
	<script type="text/javascript" src="js/lib/template.min.js"></script>
	<script type="text/javascript" src="js/lib/Jingle.debug.js"></script>

html(具体请参见demo中index.html):

	<div id="aside_container"><!---侧边栏容器--->
	    <aside id="index_aside" data-position="left" data-transition="reveal" data-show-close="true">
	        侧边栏
	    </aside>
	    <aside id="main_aside" data-position="left" data-transition="reveal" data-show-close="true">
	        侧边栏
	    </aside>
	</div>
	<div id="section_container"><!--页面容器--->
	    <section id="index_section" class="active">
	        <header>
	            <nav class="left">
	                <a data-target="menu" data-icon="menu" href="#index_aside"></a>
	            </nav>
	            <h1 class="title">Jingle</h1>
	            <nav class="right">
	                <a href="#about_section" class="button" data-target="section" data-icon="question"></a>
	            </nav>
	        </header>
	        <footer>
	            <a  href="#" data-target="article" data-icon="book" class="active">book</a>
	            <a  href="#" data-target="article" data-icon="pencil">pencil</a>
	            <a  href="#" data-icon="ellipsis">more</a>
	        </footer>
	        <article class="active">
	            <!---do it yourself --->
	        </article>
	    </section>
	</div>

初始化Jingle:

	Jingle.launch();


