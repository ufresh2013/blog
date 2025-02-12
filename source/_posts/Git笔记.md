---
title: Git命令
date: 2018-09-13 15:00:00
category: Basic
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
  $ git merge master --no-ff

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

#### 3.2 fetch 与 pull
当`git fetch`命令从服务器上抓取本地没有的数据时，它并不会修改工作目录中的内容。它只会获取数据然后让你自己合并。`git pull`在大多数情况下是一个`git fetch`紧接着一个`git merge`命令。

#### 3.3 git工作流程最佳实践
Git Flow模型中定义了主分支和辅助分支两类分支。其中主分支用于组织与软件开发，部署相关的活动；辅助分支为了解决特定的问题而进行的各种开发活动。[具体查看](https://blog.csdn.net/Eacter/article/details/78552607)
- 主分支：master / develop
- 辅助分支： feature / release / hotfix
<img src="1.png" style="padding-top:20px">

#### 3.4 变基与合并
- 合并(Merge): 它会把两个分支的最新快照(C3 和 C4)以及两者的共同祖先(C2)进行三方合并，合并的结果是生成一个新的快照(并提交)。
<img src="2.png" style="padding-top:20px">

<br>
- 变基(Rebase): 提取在C4中引入的补丁和修改，然后再C3的基础上应用一次。
**变基的风险**: 变基操作的实质是丢弃一些现有的提交，然后相应地新建一些内容一样但实际上不同的提交。如果你已经将提交推送至某个仓库，而其他人也已经从该仓库拉取提交并进行了后续工作，此时，你用 git rebase 命令重新整理了提交并再次推送，你的同伴因此将不得不再次将他们手头的工作与你的提交进行整合，如果接下来你还要拉取并整合他们修改过的提交，事情就会变得一团糟。总的原则是，不要对在你的仓库外有副本的分支执行变基。
<img src="3.png" style="padding-top:20px">

<br>
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
<br>

#### 4.2 暂存文件
将当前工作区的修改暂存起来，stash后，可以将其重新应用到当前工作区。
```
  $ git stash
  $ git stash apply
```
<br>

#### 4.3 撤销错误commit
- 错误commit后，仅撤销commit, 暂存区、工作内容不变
*注意: commit-id为错误commit之前的commit-id*
```
  $ git log
  $ git reset --soft commit-id 
```

- 错误commit后，撤销commit和add， 工作内容不变
```
  $ git log
  $ git reset --mixed commit-id
  // 该命令相当于恢复到git add 之前的状态，同时工作区的内容不变
```

- 错误commit后，想恢复到某个版本库的代码（暂存区、工作区均改变）
```
  $ git log
  $ git reset --hard commit-id
```

- 撤销已经push至远端仓库的commit
撤回后直接push, 会报错。 因为本地项目版本号低于远端仓库版本号。
```
error: failed to push some refs to 'https://github.com/ufresh2013/elite-wagtail.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
```

这时，可以添加参数`force`强制提交， 达到撤销远端版本号的目的。
```
git log
git reset --mixed commit-id
git push origin master --force // 强制提交当前版本号，撤销远端错误commit

// 重新提交
git add
git commit
git push
```
<br>

#### 4.4 合并commit
通过变基，可以将一连串提交压缩成一个单独的提交。
假设已经存在3个commit
```
git log
commit commitId3   add line 3
commit commitId2   add line 2
commit commitId1   add line 1
```

现在我们需要把add line 2, add line 3这两个commit合并成一个commit。pick会执行这个commit, squash会把这个commit合并到前一个commit。`wq`保存后，会继续跳到commit message。
```
git rebase -i commitId1

pick commitId2 add line 2
squash commitId3 add line 3
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
```


<br/>
#### 4.5 拆分commit
拆分一个提交会撤销这个提交，然后多次地部分第暂存与提交知道完成你所需次数的提交。
```
  $ git reset HEAD^
  实际上将会撤销那次提交并将修改的文件未暂存
```

- 从每一个提交移除一个文件: 有人粗心地通过`git add .` 提交了一个巨大的二进制文件，你想要从所有地方删除它。可能偶然提交了一个包含密码的文件，然而你想开源项目。
```
  $ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
```
<br>

#### 4.6 Git钩子
Git 能在特定的重要动作发生时触发自定义脚本。客户端钩子由诸如提交和合并这样的操作所调用，而服务器端钩子作用于诸如接收被推送的提交这样的联网操作。
<br>

#### 4.7 Github Pages
- Create a repository.
- Go to the folder where you want to store your project, and clone the new repository
` git clone https://github.com/username/username.github.io`
- Enter the project folder and add an index.html file
` echo "hello world" > index.html `
- Add, commit, and push your changes
- Fire up a broswer and go to http://username.github.io

<br>
<br/>

### 5. Commitizen规范提交信息
commitizen是AngularJS项目中用到的Git Commit Guidelines。用来规范commit信息，遵循一定的范式，便于日后追踪问题。

```shell
# 全局安装commitizen
npm install -g commitizen

# 在项目目录里，运行下面命令，使其支持angular的commite message格式
commitizen init cz-conventional-changelog --save --save-exact

```
凡是用到git commit命令，一律改为使用git cz，就会出现选项，用来生成符合格式的commit message

<img src="4.png" style="max-width: 500px">


<br/>
### 参考资料
- [Git官方文档](https://git-scm.com/book/zh/v2)
- [Git工作流程最佳实践--git flow](https://blog.csdn.net/Eacter/article/details/78552607)
- [Git撤销已经推送(push)至远端仓库的提交(commit)信息](https://blog.csdn.net/hanchao5272/article/details/79435730)
- [git commit 规范指南](https://www.jianshu.com/p/201bd81e7dc9?utm_source=oschina-app)
- https://www.cnblogs.com/imzhi/p/solution-to-git-checkout-error-tips.html
- https://blog.csdn.net/u012117723/article/details/52954721/
- https://www.cnblogs.com/jiaoshou/p/11218526.html