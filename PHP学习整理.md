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
+ 过滤方式:
          * FILTER_VALIDATE_BOOLEAN 验证是否是布尔值
          * FILTER_VALIDATE_EMAIL   验证是否是邮箱地址
          * FILTER_VALIDATE_FLOAT   验证是否为浮点型     $option decimal
          * FILTER_VALIDATE_INT     验证是否为整型       $option min_range max_range
          * FILTER_VALIDATE_IP      验证是否为IP地址
          * FILTER_VALIDATE_MAC     验证MAC地址
          * FILTER_VALIDATE_REGEXP  验证是否为正则
          * FILTER_VALIDATE_URL     验证是否是地址
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
+ 类型说明符:
           * b ：二进制
           * c : 字符ASCII
           * d : 十进制整数
           * e : 科学计数法
           * f : 浮点数
           * o : 八进制
           * s : 字符串
           * x : 十六进制

##拓展:sprint_r($var,$return)
+ 如果 $return 为TURE的时候，则直接返回，并不输出
+
#配置文件
+ 作用：定义常量  建立站点范围内的设置  创建用户自定义函数  管理错误

#debug
+ debug_print_backtrace():打印出一个页面的调用过程
+ error_log($msg,$msg_type,$dest):
          * $msg_type:
          * 0 : 发送到PHP的系统日志
          * 1 : 发送到设置的邮件里
          * 2 : 发送到文件里
          * 3 : 发送到SAPI的日志处理程序中
