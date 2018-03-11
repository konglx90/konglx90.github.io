---
layout: post
title: Fabric学习笔记
description: Python常用的项目自动化部署工具
category: blog
---

## Fabric 笔记

### 能做什么？
	
- executing local or remote shell commands
- uploading/downloading files
- others auxiliary functionality

###安装
`pip install fabric`

编辑一个fabfile，将文件名命名为fabfile.py
```
from fabric.api import run

def host_type():
    run('uname -s')
```

###使用命令行工具fab
`fab -H localhost, remotehost host_type`
`命令行工具fab -H参数 代表后面输入host参数  任务名`

概论

字典 env
env.user
env.password
env.warn_only
env.hosts
等等

###上下文管理器
```
from fabric.api import settings, run

def exists(path):
    with settings(warn_only=True):
        return run('test -e %s' % path)
```

### 临时指定user
```
from fabric.api import env, run

env.user = 'implicit_user'
env.hosts = ['host1', 'explicit_user@host2', 'host3']

def print_user():
    with hide('running'):
        run('echo "%(user)s"' % env)
```


### fabric 的执行策略


 - 一列任务被创建， 作为一个参数传给fab， 任务保持给定的顺序
 -  对于不同的任务指定hosts的[分配的方法见](http://docs.fabfile.org/en/1.11/usage/execution.html)
- 每个任务按顺序执行， 在每个host里只执行一次。
- Tasks with no hosts in their host list are considered local-only, and will always run once and only once. （试了好像不行， 没有host就执行不了run, 提示`No hosts found. Please specify (single) host string for connection: `）
fab options and arguments


### fab 的选项与参数
#### fab --help 
```
Usage: fab [options] <command>[:arg1,arg2=val2,host=foo,hosts='h1;h2',...] ...

Options:
  -h, --help            show this help message and exit
  -d NAME, --display=NAME
                        print detailed info about command NAME
  -F FORMAT, --list-format=FORMAT
                        formats --list, choices: short, normal, nested
  -I, --initial-password-prompt
                        Force password prompt up-front
  -l, --list            print list of possible commands and exit
  --set=KEY=VALUE,...   comma separated KEY=VALUE pairs to set Fab env vars
  --shortlist           alias for -F short --list
  -V, --version         show program's version number and exit
  -a, --no_agent        don't use the running SSH agent
  -A, --forward-agent   forward local agent to remote end
  --abort-on-prompts    abort instead of prompting (for password, host, etc)
  -c PATH, --config=PATH
                        specify location of config file to use
  --colorize-errors     Color error output
  -D, --disable-known-hosts
                        do not load user known_hosts file
  -e, --eagerly-disconnect
                        disconnect from hosts as soon as possible
  -f PATH, --fabfile=PATH
                        python module file to import, e.g. '../other.py'
  -g HOST, --gateway=HOST
                        gateway host to connect through
  --gss-auth            Use GSS-API authentication
  --gss-deleg           Delegate GSS-API client credentials or not
  --gss-kex             Perform GSS-API Key Exchange and user authentication
  --hide=LEVELS         comma-separated list of output levels to hide
  -H HOSTS, --hosts=HOSTS
                        comma-separated list of hosts to operate on
  -i PATH               path to SSH private key file. May be repeated.
  -k, --no-keys         don't load private key files from ~/.ssh/
  --keepalive=N         enables a keepalive every N seconds
  --linewise            print line-by-line instead of byte-by-byte
  -n M, --connection-attempts=M
                        make M attempts to connect before giving up
  --no-pty              do not use pseudo-terminal in run/sudo
  -p PASSWORD, --password=PASSWORD
                        password for use with authentication and/or sudo
  -P, --parallel        default to parallel execution method
  --port=PORT           SSH connection port
  -r, --reject-unknown-hosts
                        reject unknown hosts
  --system-known-hosts=SYSTEM_KNOWN_HOSTS
                        load system known_hosts file before reading user
                        known_hosts
  -R ROLES, --roles=ROLES
                        comma-separated list of roles to operate on
  -s SHELL, --shell=SHELL
                        specify a new shell, defaults to '/bin/bash -l -c'
  --show=LEVELS         comma-separated list of output levels to show
  --skip-bad-hosts      skip over hosts that can't be reached
  --skip-unknown-tasks  skip over unknown tasks
  --ssh-config-path=PATH
                        Path to SSH config file
  -t N, --timeout=N     set connection timeout to N seconds
  -T N, --command-timeout=N
                        set remote command timeout to N seconds
  -u USER, --user=USER  username to use when connecting to remote hosts
  -w, --warn-only       warn, instead of abort, when commands fail
  -x HOSTS, --exclude-hosts=HOSTS
                        comma-separated list of hosts to exclude
  -z INT, --pool-size=INT
                        number of concurrent processes to use in parallel mode
```


### 并行执行

如：

```
from fabric.api import *

def update():
    with cd("/srv/django/myapp"):
        run("git pull")

def reload():
    sudo("service apache2 reload")
```
`fab -H web1,web2,web3 update reload`

如果不是并行执行的

```
1.update on web1
2.update on web2
3.update on web3
4.reload on web1
5.reload on web2
6.reload on web3
```

如果是并行执行的

```
1.update on web1, web2, and web3
2.reload on web1, web2, and web3
```

假定update需要5秒， reload需要2秒
那么非并行的需要花费时间（5+2）* 3 = 21秒，如果是并行的花费的时间就是5+2=7秒， 在fabric里是使用多进程实现并发的， 可以很好的避免全局解释器锁的限制。

使用并发， 相对于每个任务而言

version1: 通过装饰器

```
from fabric.api import *


@parallel
def runs_in_parallel():
    pass

def runs_serially():
    pass
```

如果执行`fab -H host1,host2,host3 runs_in_parallel runs_serially`， 则执行顺序为

```
1. runs_in_parallel on host1, host2, and host3
2. runs_serially on host1
3. runs_serially on host2
4. runs_serially on host3
```

version2: 通过命令行来指定`-P`， 但需要指定非并行任务

```
from fabric.api import *

def runs_in_parallel():
    pass

@serial
def runs_serially():
    pass
```

`fab -H host1,host2,host3 -P runs_in_parallel runs_serially`


对于有大量host需要操作， 有io操作非常频繁的任务， 一般会规定进程池的大小， 限定并发量。

两种方法
1. 为装饰器传入参数

```
from fabric.api import *

@parallel(pool_size=5)
def heavy_task():
    # lots of heavy local lifting or lots of IO here
```
Or skip the pool_size kwarg and instead:

2. 通过命令行参数 -z 指定

```
$ fab -P -z 5 heavy_task
```


### 定义任务`@task`装饰器

有了这个装饰器就可以， 为任务取别名

```
from fabric.api import task

@task(alias='dwm')
def deploy_with_migrations():
    pass
```

得到

```
$ fab --list
Available commands:
    deploy_with_migrations
    dwm
```

将任务写成面向对象的， 继承自`from fabric.tasks import Task`

```
class MyTask(Task):
    name = "deploy"
    def run(self, environment, domain="whatever.com"):
        run("git clone foo")
        sudo("service apache2 restart")

instance = MyTask()
```

与这个一样

```
@task
def deploy(environment, domain="whatever.com"):
    run("git clone foo")
    sudo("service apache2 restart")
```

使用自己的Task类

```
from fabric.api import task
from fabric.tasks import Task

class CustomTask(Task):
    def __init__(self, func, myarg, *args, **kwargs):
        super(CustomTask, self).__init__(*args, **kwargs)
        self.func = func
        self.myarg = myarg

    def run(self, *args, **kwargs):
        return self.func(*args, **kwargs)

@task(task_class=CustomTask, myarg='value', alias='at')
def actual_task():
    pass


task_obj = CustomTask(actual_task, myarg='value')

```

### 命名空间
目录树

```
fabfile
├── __init__.py
```

__init__.py 里的代码

```
from fabric.api import task

@task
def deploy():
    pass

@task
def compress():
    pass
```

结果

```
$ fab --list
Available commands:
    compress
    deploy

```

加入lb.py:

```
from fabric.api import task
@task
def add_backend():
    pass
```
And we’ll add this to the top of __init__.py:

`import lb`
现在 

`fab --list` :

```
deploy
compress
lb.add_backend
```

命名空间还可以实现更深层次的嵌套， 将下一层同第一层一样做出Python的包就可以了。
如:

```
.
├── __init__.py
├── db
│   ├── __init__.py
│   └── migrations.py
└── lb.py
```

如果你不想你的全部函数暴露给fabric 的话， 可以在lb.py中加入

先加入
```
@task
def hidden_task():
    pass
```

`fab --list`

我们如愿得到

```
Available commands:
    compress
    deploy
    lb.add_backend
    lb.hidden_task

```

现在我们想要把hidden-task隐藏

在lb.py的头部加上你想要暴露的即可
`__all__ = ['add_backend']`

格式化输出
`fab --list-format=nested --list`

```
Available commands (remember to call as module.[...].task):

    compress
    deploy
    lb:
        add_backend
```

### 终端文本的颜色

```
fabric.colors.blue(text, bold=False)
fabric.colors.cyan(text, bold=False)
fabric.colors.green(text, bold=False)
fabric.colors.magenta(text, bold=False)
fabric.colors.red(text, bold=False)
fabric.colors.white(text, bold=False)
fabric.colors.yellow(text, bold=False)
```

发现没有黑色， 嗯大部分实用的终端都是黑色的，如果你实在喜欢用白色的终端， 可以试试用这个打印出黑色。

```
from fabric.colors import red, green, _wrap_with

# 可以打印出黑色的text
print _wrap_with('30')("i am black")
```


### 上下文管理器

show、hide、lcd、cd、prefix等等


### [装饰器](http://docs.fabfile.org/en/1.11/api/core/decorators.html)
hosts、parallel、roles、runs_once、task、serial

### [网络有关的部分](http://docs.fabfile.org/en/1.11/api/core/network.html)

### 一些常用的操作

- get() 从远程站点下载文件
- local() 在本地运行命令
- prompt() 键盘输入，像raw_input， 而且可以利用正则表达式对输入进行验证

```
# Simplest form:
environment = prompt('Please specify target environment: ')

# With default, and storing as env.dish:
prompt('Specify favorite dish: ', 'dish', default='spam & eggs')

# With validation, i.e. requiring integer input:
prompt('Please specify process nice level: ', key='nice', validate=int)

# With validation against a regular expression:
release = prompt('Please supply a release name',
        validate=r'^\w+-\d+(\.\d+)?$')

# Prompt regardless of the global abort-on-prompts setting:
with settings(abort_on_prompts=False):
    prompt('I seriously need an answer on this! ') 
```
- put() 上传文件到远程主机
- run()  在远程主机上运行命令
- sudo() 使用超级用户的权限， 在远程主机上运行命令