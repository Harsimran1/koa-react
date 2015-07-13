var koa = require('koa');
var app = koa();
var koa_static = require('koa-static');
var fs = require('fs')
var router = require('koa-router')();
var views = require("co-views");
var  koaBody = require('koa-body')();
var render = views("public", { map: { html: 'swig' }});
app.use(koa_static(__dirname));
var bodyParser = require('koa-body-parser');
app.use(bodyParser());
app.use(router.routes())
app.use(router.allowedMethods());

router.get('/persons.json', function() {
    fs.readFile('persons.json', function(err, data) {
        this.body=JSON.stringify(data);
    });
});

router.post('/persons.json',koaBody,function() {
    var param=this.request.body;
    fs.readFile('persons.json', function (err, data) {
        var comments = JSON.parse(data);
        comments.push(param);
        fs.writeFile('persons.json', JSON.stringify(comments, null, 4), function(err) {
        });
        this.body=JSON.stringify(data);
    });
});

router.get('/', function *(next) {
    this.body = yield render("index");
})


app.listen(3000);
console.log('Koa listening on port 3000');


