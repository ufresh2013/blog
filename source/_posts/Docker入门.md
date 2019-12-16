---
title: Docker基本概念与操作
date: 2018-09-08 15:56:08
category: 其他
---
### 1. Docker是什么？
Docker是一个虚拟环境容器，可以将你的开发环境、代码、配置文件等一并打包到这个容器中，并发布和应用到任意平台中。比如，你在本地用Python开发网站后台，开发测试完成后，就可以将Python3及其依赖包、Flask及其各种插件、Mysql、Nginx等打包到一个容器中，然后部署到任意你想部署到的环境。

Docker is an open platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly.

<br>
### 2. Docker Engine
最核心的是Docker Daemon，称之为Docker守护进程，也就是server端。Sever端与客户端通过REST API 进行通信。客户端提供一个只读的镜像，通过镜像可以创建一个或多个容器，容器在docker client中只是一个进程，两个进程是互不可见的。

The Cli uses the Docker REST API to control or interact with the Docker daemon through scripting or direct CLI commands. The daemon creates and manages Docker objects, such as images, container, networks and wolumes.
<img src="1.jpeg" style="padding-top:20px; max-width: 380px">

<br>
### 3. Docker架构与基本概念
镜像是Docker生命周期中的构建或打包阶段，而容器则是启动或执行阶段。

A container is launched by running an image. An image is an executable package that includes everything needed to run an application – the code, a runtime, libraries, environment variables, and configuration files.
<img src="2.jpeg" style="padding-top:20px">

<br>
#### 3.1 镜像(Docker Image)
An image is a read-only template with instructions for creating a Docker container.

镜像是一种层式结构。由一系列指令一步步构建出来：执行一条命令，添加文件或文件夹，创建环境变量，容器启动时-运行什么环境。
当用户修改一个Docker Image的时候（比如更新应用程序）一个新的层就会被建立。因此，这是一种增量式的修改，而不是新建一个全新的Image，这也是区别于传统虚拟机的一点。当你发布一个新的Image时，你只需要发布差异的部分，因此速度就非常快。
<img src="3.jpeg" style="padding-top:20px; max-width:300px">

<br>
#### 3.2 容器（Container）
A container is a runnable instance of an image.

Docker在文件系统内部用这个镜像创建了一个新容器。该容器拥有自己的网络、IP地址，以及一个用来和宿主机进行通信的桥接网络接口。

打个比方，你首先下载了一个Ubuntu的镜像，然后又安装了mysql和Django应用及依赖，来完成对Ubutun镜像的修改，生成了一个应用镜像。然后，你把这个镜像分享给大家使用，大家通过这个镜像生成了一个容器，容器启动后就会运行Django服务。

<br>
#### 3.3 仓库（Docker Repository）
Docker用来存放镜像的。共有仓库docker hub提供了非常多的镜像文件，这些镜像直接拉取下来就可以运行了，你也可以上传自己的镜像到docker hub上，搭建私有仓库。
- 开发构建镜像并将镜像push到docker仓库
- 测试或者运维从docker仓库拷贝一份镜像到本地
- 通过镜像文件开启docker容器并提供服务
<img src="4.jpeg" style="padding-top:20px">

<br>
### 4. 怎么用Docker完成持续集成、自动交付、自动部署？
搭建一个完整的自动化流程还需要github+Jenkins+registry三样帮助。
- 开发人员推送代码到git，git服务器通过hook通知jenkis
- jenkins克隆git代码到本地，并通过dockerFile文件进行编译
- 打包生成一个新版本的镜像并推送到仓库，删除当前容器，通过新版本镜像重新运行。
开发只需git add *, git commit -m “”, git push即可完成持续集成、自动交付、自动部署。
<img src="5.jpeg" style="padding-top:20px">

<br>
### 5. Docker基本命令
镜像的操作| |
---|:--:|---:
$ docker search centos	| 查看镜像是否存在
$ docker pull centos	  | 获取镜像
$ docker build	        | 创建镜像（利用Dockerfile）
$ docker images ls	    | 查看镜像
$ docker commit	        | 将容器转化为一个镜像
$ docker rmi image_name/image_id	| 删除镜像
容器的操作	| 
$ docker run	          | 基于镜像启动容器
$ docker container ls	  | 查看容器
$ docker start container_name/container_id  	| 启动容器
$ docker stop container_name/container_id	    | 停止容器
$ docker restart container_name/container_id	| 重启容器
$ docker rm container_name/container_id	      | 删除容器
$ docker exec -it container-id /bin/bash      | 进入容器
仓库的操作	|
$ docker login	                | 登录Dockerhub
$ docker push xianhu/centos:git	| 将本地的镜像推送到Dockerhub
$ docker pull xianhu/centos:git	| 从你的仓库中下载镜像

<br>
### 6. 操作示例
https://docs.docker.com/get-started
#### 5.1 Orientation (Set up your Docker environment)
```
  # Display docker version and info
  docker –version
  docker info

  # Execute Docker image
  docker run hello-world

  # list Docker images
  docker image ls

  # list Docker containers 
  docker container ls 
```

#### 5.2  Containers(Build an image and run it as one container)
```
  # Create an empty directory. Cd into the new directory, create a file call Dockerfile.
  mkdir docker-test
  cd docker-test
  touch Dockerfile
  vim Dockerfile

  # copy-and-paste the follow content into the Dockerfile
    # Use an official Python runtime as a parent image
    FROM python:2.7-slim

    # Set the working directory to /app
    WORKDIR /app

    # Copy the current directory contents into the container at /app
    ADD . /app

    # Install any needed packages specified in requirements.txt
    RUN pip install --trusted-host pypi.python.org -r requirements.txt

    # Make port 80 available to the world outside this container
    EXPOSE 80

    # Define environment variable
    ENV NAME World

    # Run app.py when the container launches
    CMD ["python", "app.py"]


  # create two more files, requirements.txt and app.py.
  requirements.txt
    Flask
    Redis

  app.py
    from flask import Flask
    from redis import Redis, RedisError
    import os
    import socket

    # Connect to Redis
    redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

    app = Flask(__name__)

    @app.route("/")
    def hello():
        try:
            visits = redis.incr("counter")
        except RedisError:
            visits = "<i>cannot connect to Redis, counter disabled</i>"

        html = "<h3>Hello {name}!</h3>" \
                "<b>Hostname:</b> {hostname}<br/>" \
                "<b>Visits:</b> {visits}"
        return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

    if __name__ == "__main__":
        app.run(host='0.0.0.0', port=80)

```
#### 5.3 Build and run the app
```
  # Creates a Docker image
  docker build -t friendlyhello .
  docker image ls

  # Run the app
  docker run -p 4000:80 friendlyhello

  # Run the app in the background, in detached mode:
  $ docker run -d -p 4000:80 friendlyhello

  Stop the process with the container id
  $ docker container stop 1fa4ab2cf395


  # visit the URL 
  http://localhost:4000

```
#### 5.4 Share your image
```
  Share your image
  # login in with your docker ID
  docker login

  # Tag the image
  docker tag image username/repository:tag
  docker tag friendlyhello ufresh/get-started:part2

  # Publish the image
  docker push username/repository:tag

  # Pull and run the image from the remote repository
  docker run -p 4000:80 username/repository:tag

```




