var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var interface = ['/login','/register']

http.createServer(function(request, response){
    response.setHeader('Access-Control-Allow-Origin','*')

    if(request.method === "POST"){
        var result = ''
        var pathName = url.parse(request.url).pathname  //请求接口
        request.on('data', function(chunk){
            result += chunk
        })
        request.on('end' , function(){
            var user = qs.parse(result)
            console.log('user:',user)
            if(user.username){
                //读取db.txt  有无数据
                fs.readFile('db.txt', function(err, data){
                    var data = data.toString()
                    if(!data){   //没有数据
                        if(pathName === interface[0]){  //登录
                            response.end('该用户未注册')
                        }else {  //注册
                            var arr = []
                            arr.push({
                                username:user.username,
                                password:user.password
                            })
                            fs.writeFileSync('db.txt',JSON.stringify(arr))
                            response.end('注册成功')
                        }
                    }else{  //已有数据， 是否匹配再做相应的操作
                        console.log('已有数据')
                        var dataList = JSON.parse(data)
                        for(var i=0; i<dataList.length;i++){
                            if(dataList[i].username === user.username){
                                if(pathName === interface[0]){  //登录
                                    var psw = 'password'
                                    dataList[i][psw] === user[psw] ? response.end('登录成功') : response.end('密码错误')
                                    return
                                }else {  //注册
                                    response.end('该用户名已存在')
                                    return
                                }
                            }
                        }
                        if(pathName === interface[0]){  //登录
                            response.end('该用户名不存在')
                        }else{   //注册
                            dataList.push({
                                username:user.username,
                                password:user.password
                            })
                            fs.writeFileSync('db.txt',JSON.stringify(dataList))
                            response.end('注册成功')
                        }

                    }
                })

            }else{
                response.end('请输入用户名')
            }
        })

    }else{
        console.log('get请求')
    }

}).listen(3000, function(err){
    if(!err){
        console.log('服务器启动成功，正在监听port3000...')
    }
})
