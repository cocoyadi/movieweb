/**
* Created by yadi_coco on 2017/8/12.
 **/
//加载express模块
var express=require("express");
var path=require("path");
var mongoose=require("mongoose")
var serveStatic = require('serve-static');
//设置日志信息
var morgan = require('morgan');
// 加载表单序列化模块
var bodyParser = require('body-parser');
var dbUrl="mongodb://localhost/movie";

//替换mongoose默认的promise为全局的promise
mongoose.Promise = global.Promise;
//获取环境变量的端口
var port=process.env.PORT||3000;

//创建服务应用实例
var app=express();


//mongodb中的promise已经被废弃了，用原生的promise替代
mongoose.Promise = global.Promise;
//连接数据库
mongoose.connect(dbUrl,{useMongoClient:true})


//设置视图的根目录
app.set("views","./app/views/pages");
//设置模板引擎
app.set("view engine","jade");
//这里要改为true，不然会导致获取不到对象
app.use(bodyParser.urlencoded({ extended: true }))
//拼接路径以访问样式
app.use(serveStatic('public'));
app.listen(port);

//在应用中使用session（新版的已经不需要依赖cookie中间件了）
var session = require('express-session')
//利用mongo做持久化
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'movieweb',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url:dbUrl,
        collections:"sessions"
    })
}))

// 加载时间处理模块
// app.locals对象字面量中定义的键值对，
// 是可以直接在模板中使用的，
// 就和res.render时开发者传入的模板渲染参数一样
// 这里是指可以在模板中使用moment方法
// 在list.jade中我们需要将数据中的时间转换成mm/dd/yyyy
// 那么就需要用到moment，所以这里是为了将该方法能传入到模板中
// 这里如果换成app.locals.dateFun = require('moment');
// 在list模板中我们就需要 #{dateFun(xxxxx).format(MM/DD/YYYY)}
app.locals.moment = require('moment');
console.log("web start on "+port);

//配置日志文件信息，判断如果是开发环境，则打印日志信息
if("development"==app.get("env")){
    app.set("showStackError",true);
    //输出方法，路径和状态
    app.use(morgan(':method :url :status'));
    app.locals.pretty=true;
    mongoose.set('debug',true);
}

//导出模块
require('./config/routes')(app);
