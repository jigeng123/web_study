# 1.0-构建初始html结构

构建三个区域
1. h1说明--用于说说明当前阶段的内容
2. 测试按钮--每个按钮执行一个函数,用于测试,在test.js
3. app主功能区✅✅✅

# 1.1-构建结构数据

## test.js中构建初始化数据,这里一般是后端传送的文件数据

数据结构为json格式:[初始结构.json](readme.md)
### 共同点
两个node,都有id,content,tags,metadata
1. id:唯一值,必须得有的值
2. content:内容,文本
3. tags:标签,列表[模拟列表操作]
4. metadata:元数据,字典键对值[模拟字典操作]
### 不同点
第一个有children,支持子node
子node也是id,content,tags,metadata结构

## 点击[首次渲染]按钮,执行initialRender(初始化数据结构)

执行renderhtml(初始化数据结构)

## renderhtml(数据结构,所要放的容器id),渲染html

如果没有传入容器,则默认为app-container
如果传入的容器不存在,则默认使用app-container
调用renderdata()

## renderdata(数据,容器)开始渲染数据
判断传入数据集,是否为数组
如果不是数组,是字典,则用[]包裹
如果不是字典和数组,则直接终端,console.warn
遍历数组每一个元素,调用processNode(元素数据,要加入的父容器)

## processNode(元素数据,要加入的父容器)
1. 数据必须得有id,如果没有,就报错
2. 选择要操作的node--查找是否有这个id,如果有则更新,如果没有则在父容器创建全新的node(div class="node",使用传入的数据的id)
3. 使用变量key遍历数据结构所有的键值(除了id键值)--找到对象[propertyHandlers],判断[key]是否存在,(propertyHandlers中,每个key对应一个函数)
4. 将[要操作的node]和[数据中key的值]传入给[propertyHandlers对应key的函数]

## propertyHandlers{},一个专门处理各种属性的对象
针对不同属性具有不同处理方法
配合一个辅助函数--[findOrCreateElement] (父元素:node节点,要找的元素的class,如果没有创建的元素,创建的元素的class)
TODO后续可以添加type数据,根据type创建元素,以及内容
### content构建文本内容
找到容器中是否有class为content的元素,没有就创建一个P class=content的元素
将元素的textcontent改成content
### tags添加标签(列表处理示例--清空原始内容,不清空原始内容需要设置id,不然不好找,列表不容易实现)
判断是否为列表,不是的话就返回,不执行
找到容器中是否有class为tags-container的元素,没有就创建一个div class=tags-container的元素
继续找tagsContainer中有没有ul,如果没有创建一个ul(列表)
清空ul,遍历tag列表,创建li
### metadata(字典处理示例--清空原始内容,不清空原始内容需要设置id,不然不好找,字典可以实现但是metadata不太需要)
查找容器中是否有metadata-container元素,没有就创建一个div class=metadata-container的元素
清空metadata
遍历所有的metadata,创建一个span,将key的首字母大写,加上后面的字符,span的内容为键:值
添加到metadata-container
### children(字典递归示例--不清空原始内容)
查找容器是否有children-container元素,没有就创建一个div class=children-container的元素
递归调用renderData函数(children的值当作数据结构传入,容器为children-container)


## updatarender函数
同initialrender
tags和metadate都会清空内容重新构建,但是数据数据比较少,所以无所谓
children是带有id的,可以动态更新而不删减
TODO可以每次更新执行saveData
## clearRender函数
直接将app-container的内容删除

## saveData函数
log(开始导出数据)
执行saveDataStructure()
### saveDataStructure(containerId = "app-container")
找到要提取容器的元素,如果没填写默认为app-container(整个应用的容器)
没找到报错(几乎不可能出错,除非app-container删除)
最终输出的数据保存在变量[exportedData],现在为空
找打app-container scope中class为node的元素
遍历每个node,执行[extractNodeData函数](#extractnodedata函数--返回data数据)
如果存在就添加到最终输出的数据[exportedData]
将最中保存的数据,json化,并返回
TODO传送给后端

#### extractNodeData函数--返回data数据
根据传入的元素来构建json数据结构
如果没有id,直接返回报错
##### 构建初始化数据结构--{id:元素.id}
##### 构建content内容
使用extractContent()提取内容
###### extractContent(元素)
查找.content,获取textContent,并返回
##### 构建tags内容
使用extractTags()提取内容
###### extractTags(元素)
查找.tags-container的ul
找到所有的li的textcontent,加入到列表,返回列表
##### 构建tags内容
使用extractMetadata()提取内容
###### Metadata(元素)
查找.metadata-container
找到所有的span的textcontent,
根据冒号":"拆分span,前面变成key,后买你变成值
加入到字典,返回字典
##### 构建children内容
使用extractChildren()提取内容
###### extractChildren(元素)
查找.children-container
获取容器内所有的node元素

每个node传入[跳转到extractNodeData()递归生成](#extractnodedata函数--返回data数据)

加入到列表,返回列表

# 扩展点
TODO扩展点:css,查看CodePen / JSFiddle / JSBin上的示例抄过来.简单的可以使用Pinegrow来可视化
TODO添加后端
TODO根据项目更改数据模型,只需要调整-[propertyHandelers],注册并实现创建不同的数据结构对应的函数,[extractNodeData]中注册并实现不同类型的提取函数

