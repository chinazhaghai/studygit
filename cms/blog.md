个人博客开发日记
===
# 第一天
+ 博客实现的基本功能
  + 管理员信息
    + 新增管理员
    + 删除管理员
    + 修改管理员信息
    + 权限管理
  + 博客的管理
    + 新增博客
    + 删除博客
    + 修改博客
    + 生成博客链接，以便于分享
  + 留言管理
    + 留言板审核
    + 留言删除

# 第二天
+ 数据表结构
  + 管理员表
    * id           tinyint        管理员编号
    * name         varchar(20)    管理员账号
    * password     varchar(40)    管理员密码 
    * loginTime    timestamp      管理员登录时间
    * auth         tinyint        管理员权限
  + 权限表
    * id          tinyint         权限编号
    * name        varchar(20)     权限名称
  + 博客表
    * id         int              文章编号
    * title      varchar(20)      文章标题
    * content    text             文章内容
    * author     tinyint          文章作者
    * time       timestamp        文章发布时间
    * category   tinyint          文章分类
  + 分类表
    * id        tinyint           文章分类编号
    * name      varchar(20)       文章分类名称
  + 留言板
    * id         int              留言编号
    * name       varchar(20)      游客昵称
    * content    text             留言内容
    * time       timestamp        留言时间
