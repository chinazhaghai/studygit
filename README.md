#github 学习手册
1.git status                查看状态
2.git log --pretty=oneline  输出日志
3.git reflog                查看操作日志
4.git add <filename>        工作区提交到暂存区
5.git rm <filename>         等价于 rm <filename> -> git add/rm <filename>
6.git commit -m "comment"   暂存区提交到master
7.git reset --hard <id>     
8.git reset --hard HEAD^/HEAD~n 回到前一个或者之前某一个状态
9.git diff <filename>       比较两个文件


#注意：
  当"工作区"文件删除的时候，但是没有提交到"暂存区"，想要恢复文件
  git --checkout <filename>
  当"工作区"文件产出的时候，并且提交到了"暂存区"，想要恢复文件
  git reset HEAD <filename>

#链接远程仓库
  git remote add origin 仓库地址    链接仓库
  git remote rm origin              删除仓库
  git push -u master origin         第一次推送到仓库
  git push master origin 
