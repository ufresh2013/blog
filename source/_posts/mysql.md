---
title: mysql
date: 2019-09-24 19:45:44
tags:
---
### 1. 安装运行
`http://dev.mysql.con/downloads/mysql`

```
cd /usr/local/mysql/bin
./mysql -u root -p
mysql>  
```

workbench 
`http://dev.mysql.com/downloads/workbench`

### 2. 基本命令
创建数据库
CREATE SCHEMA `myblog` ;

操作表
```sql
use myblog;

show tables;

insert into users(username, `password`, realname) values('zhangsan', '123', '张三');
insert into users(username, `password`, realname) values('lisi', '123', '李四');

select * from users;
select id, username from users;
select * from users where username='zhangsan' and `password`='123';
select * from users where username='zhangsan' or `password`='123';
select * from users where username like '%zhang%';
select * from users where `password` like '%1%' order by id desc;

SET SQL_SAFE_UPDATES = 0;
update users set realname='李四2' where username='lisi';

delete from users where username='lisi';
update users set state='0' where username='lisi';
```


### 3. nodejs连接mysql
```shell
npm init -y
npm i mysql --save-dev
```

```js
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rirf@849",
  port: "3306",
  database: "mybog"
});

// 开始连接
con.connect();

// 执行sql语句
const sql = "select * from users;";
con.query(sql, (err, result) => {
  if (err) {
    return console.log(err);
  }
  console.log(result);
  return result;
});

con.end();
```


### 参考资料
- [mysql8.0版本 报错：Error: ER_NOT_SUPPORTED_AUTH_MODE:](https://blog.csdn.net/weixin_36222137/article/details/81293332)