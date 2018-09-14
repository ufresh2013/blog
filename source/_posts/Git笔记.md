---
title: Git基本命令
date: 2018-09-13 15:00:00
tags:
- Git
---
### 1. Git简介
- 【直接记录快照，而非比较差异】git与其他版本控制系统的主要差别在于Git对待数据的方法。大部分系统以文件变更列表的方式存储信息。反之,Git对待数据更像是一个 **快照流**。每次你提交更新，它会对当时的全部文件制作一个快照并保存这个快照的索引。为了高效，如果文件没有修改，git不再重新存储改文件，而是只保留了一个链接指向之前存储的文件。
- 【近乎所有操作都是本地执行】git的大部分操作都只需访问本地文件和资源，因为你在本地磁盘上就有项目的完整历史。
- 【git保证完整性】所有数据再存储前都计算校验和，这意味着不可能在git不知情时更改任何文件内容或目录内容。
- 【git一般只添加数据】你的git操作，几乎只往git数据库中增加数据。很难让git直行不可逆操作，或者让它以任何方式清除数据。

<br>
### 2. Git命令
#### 2.1 获取仓库
```
  // 在现有目录中初始化仓库
  $ git init
  $ git add *.c
  $ git add LICENSE
  $ git commit -m 'initial project version'

  // 克隆现有的仓库
  $ git clone https://github.com/libgit2/libgit2
```

#### 2.2 记录每次更新到仓库
```
  $ git status
  $ git diff --cached
  $ git add 
  $ git commit -m "description"
  $ git log // 查看提交历史
```

#### 2.3 撤销操作
```
  // 发现漏了几个文件没有添加，或提交信息写错，尝试重新提交
  $ git commit -m 'initial commit'
  $ git add forgotten_file
  $ git commit --amend

  // 取消暂存的文件，意外输入git add *，如何取消暂存两个中的一个
  $ git add *
  $ git reset HEAD <file>

  // 撤销对文件的修改，将文件还原成上一次提交时的样子
  $ git checkout -- <file>
```

#### 2.4 远程仓库的使用
```
  $ git remote -v
  $ git remote add <shortname> <url>
  $ git fetch [remote-name] [branch-name]
  $ git push [remote-name] [branch-name]
  $ git remote rename [old-name] [new-name]
  $ git remote rm [remote-name]
```

<br>
### 3. Git分支
#### 3.1 分支命令
Git的分支，其实本质上仅仅是指向提交对象的可变指针。
```
  $ git branch -v

  // 新建一个分支，并切换到那个分支上
  $ git branch testing
  $ git checkout testing 
  ($ git checkout -b testing)

  // 合并分支遇到冲突，解决冲突后，对每个文件使用git add命令将其标记为冲突已解决。
  $ git merge master

  <<<<<<< HEAD:index.html
  <div id="footer">contact : email.support@github.com</div>
  =======
  <div id="footer">
  please contact us at support@github.com
  </div>
  >>>>>>> iss53:index.html

  // 删除分支
  $ git branch -d testing
```

#### 3.2 git工作流程最佳实践
Git Flow模型中定义了主分支和辅助分支两类分支。其中主分支用于组织与软件开发，部署相关的活动；辅助分支为了解决特定的问题而进行的各种开发活动。https://blog.csdn.net/Eacter/article/details/78552607 
- 主分支：master / develop
- 辅助分支： feature / release / hotfix
<img src="1.png" style="padding-top:20px">

#### 3.3 变基与合并
- 合并(Merge): 它会把两个分支的最新快照(C3 和 C4)以及两者的共同祖先(C2)进行三方合并，合并的结果是生成一个新的快照(并提交)。
<img src="2.png" style="padding-top:20px">

<br>
- 变基(Rebase): 提取在C4中引入的补丁和修改，然后再C3的基础上应用一次。
**变基的风险**: 变基操作的实质是丢弃一些现有的提交，然后相应地新建一些内容一样但实际上不同的提交。如果你已经将提交推送至某个仓库，而其他人也已经从该仓库拉取提交并进行了后续工作，此时，你用 git rebase 命令重新整理了提交并再次推送，你的同伴因此将不得不再次将他们手头的工作与你的提交进行整合，如果接下来你还要拉取并整合他们修改过的提交，事情就会变得一团糟。总的原则是，不要对在你的仓库外有副本的分支执行变基。
<img src="3.png" style="padding-top:20px">

### 4. 其他
#### 4.1 生成SSH公钥
默认情况下，用户的SSH密钥存储在其 ~/.ssh 目录下。我们需要寻找一对以id_dsa或id_ras命名的文件，其中一个带有.pub扩展名，.pub文件是你的公钥，另一个则是私钥。

如果找不到这样的文件，你可以运行ssh-keygen程序来创建它们。ssh-keygen会确认密钥的存储位置，然后它会要求你输入两次密钥口令。如果你不想在使用密钥时输入口令，将其留空即可。
```
  $ cd ~/.ssh
  $ ls
  authorized_keys2  id_dsa       known_hosts
  config            id_dsa.pub
  $ ssh-keygen
```

#### 4.2 暂存文件
将当前工作区的修改暂存起来，stash后，可以将其重新应用到当前工作区。
```
  $ git stash
  $ git stash apply
```


