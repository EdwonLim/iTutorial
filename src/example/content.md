# iTutorial 

### Prowered By [Edwon Lim](http://edwon.me)

------

# Introduction

### 一款实用的把Markdown转换为PPT的Web工具，支持远程抓取和上传MD文件，兼容各个平台，并支持在iPad上构建Web App。

 * 工具地址 : [http://edown.me/xprotect/itutorial/](http://edown.me/xprotect/itutorial/)
 * 项目地址 : [GitCafe](http://gitcafe.com/EdwonLim/iTutorial/) | [GitHub](http://github.com/EdwonLim/iTutorial/)
 * 依赖项目 :
 	* jQuery
 	* highlightJS
 	* markdownJs
 * 作者主页 : [Edwon.me](http://edown.me)
 
 
-------

# How To Use

## 工具通过Markdown的分隔符来将文档分割成PPT的各页。

	# Page1

	------
	
	# page2
	

## 其他的和Markdown语法相同，支持[绝大部分Markdown语法](http://markdown.tw)。

## 另外，对文档中的代码进行[高亮显示](http://highlightjs.org/)，所以此工具比较适合程序员制作PPT。

------

# How To Make Youslef "PPT"

* 引入 `jQuery` : http://code.jquery.com/jquery-1.10.2.min.js
* 引入此工具的样式 `iTutorial.min.css` : http://edwon.me/xproject/itutorial/iTutorial.min.css
* 引入此工具的脚本 `itutorial.min.js` : http://edwon.me/xproject/itutorial/iTutorial.min.js
* 初始化 :
  * 使用JS : `$.iTutorial.init({content : 'content.md'})` 
  * 写在Body属性中 : `<body content='content.md'>...</body>`
* Markdown文档 :
  * 如果在服务器环境下，将名为 *content.md* 的文件放在和此HTML同目录下即可
  * 如果非服务器环境下，可以将文档放在HTML中 `<code data-id="content">...</code>`
  
------

# For Easy


 * 你可以将你的md文档，上传到服务器，得到文档的连接，通过工具主页的 `Grab` 直接抓取你的md文档，生成*PPT*
 * 当然你的*PPT*路径将为 : `http://edwon.me/xproject/itutorial/?md=你的md文档路径`
 * 当你在**iPad**上用**Safari**浏览器，你可以把它`添加到主屏幕`，这样你会发现你的*PPT*将成为你**iPad**上的一个**APP**
 * 你可以在最后一页上单独写一些`CSS`代码来更改你*PPT*的样式
 
-----

# End & Thank You