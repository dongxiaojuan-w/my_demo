var express = require('express')
var app = express()

app.get('/jsonp', function (req, res) {
    let _callback = req.query.callback
    let data = {
        name:'小明',
        age: 18
    }
    let str = `${_callback}(${JSON.stringify(data)})`
    res.type("text/javascript")
    res.send(str)
})
app.post('/cors', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.json({title:'CORS 跨域'})
})

app.listen(3000);
console.log("success")
