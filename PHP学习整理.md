#《深入理解PHP高级技巧，面向对象与核心技术》 学习整理
#多维数组排序
+ 在一维数组中排序可以使用  sort asort ksort rsort arsort krsort
+ 在多维数组中排序可以使用  usort uasort uksort
+ 在自定义函数的返回值中 TRUE 则 交换两个值得位置，FALSE 或者 0 则保持不变
+ usort 是按值进行排序 并且抛弃 关键字
+ uasort 保留关键字
+ uksort 排序基于关键字
##拓展：字符串比较
+ strcmp 不区分大小写  strcasecmp 区分大小写

#filter_var
+ 说明：对变量值进行验证，是否合法
+ 参数:变量$var  过滤方式$filter 可选项$option

##过滤方式:
+ FILTER_VALIDATE_BOOLEAN 验证是否是布尔值
+ FILTER_VALIDATE_EMAIL   验证是否是邮箱地址
+ FILTER_VALIDATE_FLOAT   验证是否为浮点型     $option decimal
+ FILTER_VALIDATE_INT     验证是否为整型       $option min_range max_range
+ FILTER_VALIDATE_IP      验证是否为IP地址
+ FILTER_VALIDATE_MAC     验证MAC地址
+ FILTER_VALIDATE_REGEXP  验证是否为正则
+ FILTER_VALIDATE_URL     验证是否是地址
##拓展:strip_tag
+ 删除HTML 和 PHP 的标签

#高级函数的定义
+ 特性：递归函数  静态变量  传值与引用（传址） 匿名函数

# isset 和 empty 的区别
##isset  判断变量是否设置
+ 若变量不存在，FALSE
+ 若变量存在但值为NULL ，FALSE
+ 若变量存在并值不为NULL，TRUE

##empty 判断值是否为空
+ 若变量不存在，TRUE
+ 若变量存在且值为0，‘0’，NULL，array(),FALSE,var $var，TRUE
+ 否则为FALSE

#PHP中数据库的操作
+ mysql_connet($host,$username,$pwd,$port):链接数据库
+ mysql_select_db():选择数据库
+ mysql_query():查询 返回资源型 $res
+ mysql_fetch_array($res,MYSQL_ASSOC/MYSQL_NUM): 每次返回一行
+ mysql_fetch_row:mysql_fetch_array($res,MYSQL_NUM)
+ mysql_fetch_assoc($res):mysql_fetch_array($res,MYSQL_ASSOC)
+ mysql_affected_row($res):上一次的操作，影响的行数
+ mysql_close():关闭数据库连接

#原型文档
+ heredoc 类似 双引号
+ nowdoc  类似 单引号
+ 以<<<分界符
+ 分界符;结尾

#sprintf格式化字符串
+ 以%开始
+ +/- 强制使正数前面添加加号
+ 填充说明符标示用于右填充字符（默认空格，数字是0）
+ 对齐说明符（默认右对齐，使用减号（-）可以实现左对齐）
+ 一个数字，用于标示要占用的最小宽度
+ 精度说明符，标示浮点数小数点位数，四舍五入

##类型说明符:
+ b ：二进制
+ c : 字符ASCII
+ d : 十进制整数
+ e : 科学计数法
+ f : 浮点数
+ o : 八进制
+ s : 字符串
+ x : 十六进制

##拓展:sprint_r($var,$return)
+ 如果 $return 为TURE的时候，则直接返回，并不输出

#配置文件
+ 作用：定义常量  建立站点范围内的设置  创建用户自定义函数  管理错误

#debug
+ debug_print_backtrace():打印出一个页面的调用过程
+ error_log($msg,$msg_type,$dest):

##$msg_type:
+ 0 : 发送到PHP的系统日志
+ 1 : 发送到设置的邮件里
+ 2 : 发送到文件里
+ 3 : 发送到SAPI的日志处理程序中

#mode_rewrite 优化SEO
+ 说明：mode_rewrite 是一种用于给服务器发送指令的工具，当用户访问一个连接URL的时候，服务器将会提供另外的资源。mode_rewrite使用正则表达式，因此可以根据需要处理尽量复杂的链接地址模式
+ 修改Apache的两种方式：1.修改Apache的全局配置文件或者创建目录相关的文件。全局配置文件叫做httpd.conf,放置在confg目录内，她用于规范Apache网站服务器的运行规则；2..htaccess放置在web目录里，它使用来规范当前目录和子目录内Apache如何运行

##允许.htaccess重写
+ httpd.confg
```
+ <Directory />  #此处的(/)指的是根目录，#号表示注释
+ AllowOverride None
+ </Directory>
```
###AllowOverride
+ AuthConfig 用于使用授权和验证
+ FileInfo 用于执行重定向和URL地址重写
+ Indexes 用于列举目录内容
+ Limit 用户限制对目录的访问
+ Options 用于设置目录的行为，比如执行CGI脚本或者列举目录内容的能力
+ All 所有
+ None 无

#激活URL重写
+ 首先检查该模块是否加载并且打开重写引擎
```
+ <IfModule mode_rewrite.c>
+ RewriteEngine on
+ </IfModule>

```
+ RewriteRule match rewrite
+ eg:RewriteRule somepage.php other.php 访问somepage.php的时候，展示的是other.php的内容

```
+ <IfModule mode_rewrite.c>
+ RewriteEngine on
+ RewriteRule ^category/([0-9]+)/?$ category.php?id=$1
+ </IfModule>
```
+ 匹配category/23 或者category/23/ 转为 category.php?id=23

#调整浏览器缓存
+ header() 可以调整浏览器的缓存
+ Last-Modified 最后修改的时间
+ Expires       过期时间
+ Pragma        编译提示
+ Cache-Control 缓存控制
```
+ header("Expires:Mon,26 Jul 1997 05:00:00 GMT");
+ header("Pragma:no-cache");
+ header("Cache-Control:no-cache");
+ header("Last-modified:Mon,26 Jul 1997 05:00:00 GMT");
```
## Cache-Control 指令
+ public           可以缓存到任何地方
+ private          只能被浏览器缓存
+ no-cache         不能在任何地方缓存
+ must-revalidate  缓存必须检查更新版本
+ proxy-revalidate 代理缓存必须检查更新版本
+ max-age          内容能够被缓存的时间，以秒为单位表示
+ s-maxage         覆盖共享缓存的max-age值设置

#定义会话函数
+ 定义与数据库交互的函数
+ 让PHP来使用这些函数   通过调用函数session_set_save_handler()来完成
+ session_set_save_handler() 有6个参数，每个参数都是一个函数名
##参数说明：
+ 启动会话
+ 关闭会话
+ 读取会话数据
+ 写入会话数据
+ 销毁会话数据
+ 旧的会话数据应该被删除(也就是执行了垃圾收集程序)

### 说明：除了“读取”函数之外，其他的所有函数都必须返回一个布尔值；而“读取”函数必须返回一个字符串，空字符串也行
