/**
* Created by yadi_coco on 2017/8/12.
 **/
//加载express模块
var express=require("express");
var path=require("path");
var mongoose=require("mongoose")
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var Movie=require("./modeljs/movie");
var Movie=require("./modeljs/user");

mongoose.Promise = global.Promise;
//替换旧的字段
var _=require("underscore");
//获取环境变量的端口
var port=process.env.PORT||3000;
var app=express();


//mongodb中的promise已经被废弃了，用原生的promise替代
mongoose.Promise = global.Promise;
//连接数据库
mongoose.connect("mongodb://localhost/movie",{useMongoClient:true})

//设置视图的根目录
app.set("views","./views/pages");
//设置模板引擎
app.set("view engine","jade");
//这里要改为true，不然会导致获取不到对象
app.use(bodyParser.urlencoded({ extended: true }))
//拼接路径以访问样式
app.use(serveStatic('public'));
app.listen(port);
//在应用中使用session
app.use(express.session({
    secret:"movieweb"
}))
//session依赖cookie的中间件
app.use(express.cookieParser)
//获取应用时间
app.locals.moment=require("moment")
console.log("web start on "+port);

//index页面
app.get("/",function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render("index",{
            title:"首页",
            movies:movies
        })
    })
});

//注册
app.post('user/signup',function(req,res){
    var _user=req.body.user;

    //判断是否已经注册
    User.find({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(user){
            return res.redirect("/")
        }
        else{
            var user=new User(_user);
            user.save(function(err,user){
                if(err){
                    console.log(err)
                }
                res.redirect("/admin/userlist")
            })
        }
    })


})

//userlist页面
app.get("/admin/userlist",function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err);
        }
        res.render("userlist",{
            title:"用户列表页",
            users:users
        })
    })
})

//detail页面
app.get("/movie/:id",function(req,res){
    var id=req.params.id;
    //这里面res渲染了两次，是不被允许的，
    // 一次请求只能使用一次res.render(渲染，为了以防外一，建议res一定要加上return)
    Movie.findById(id,function(err,movie){
        //渲染detail页面
        res.render("detail",{
            title:movie.title,
            movie:movie
        })
    })
})

//singin页面
app.post('/user/signin',function(req,res){
    var _user=req.body.user;
    var name=_user.name;
    var password=_user.password;

    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err)
        }
        if(!user){
            return res.redirect("/")
        }
        //判断密码是否匹配
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err)
            }
            if(isMatch){

                //保存用户状态
                req.session.user=user;
                return res.redirect("/")
            }
            else{
                console.log("Password is not matched")
            }
        })
    })
})

app.get("/admin/list",function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render("list",{
            title:"列表页",
            movies:movies
        })
    })
})

//再刷新页面之后要对页面内容进行更新
app.get("/admin/update/:id",function(req,res){
    console.log(req.params.id)
    var id=req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            res.render("admin",{
                title:"后台更新页",
                movie:movie
            })
        })
    }
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render("index",{
            title:"首页",
            movies:movies
        })
    })
})

app.get("/admin/movie",function(req,res){
    res.render("admin",{
        title:"imoc后台录入页",
        movie:{
            doctor:"",
            country:"",
            title:"",
            year:"",
            poster:"",
            language:"",
            flash:"",
            summary:""
        }
    })
})

//存储数据（更新或者添加数据）
app.post("/admin/movie/new",function(req,res){
    console.log(req.body.movie)
    var id=req.body.movie._id;
    var movieObj=req.body.movie;
    var _movie
    //判断电影是否存储过
    if(id!='undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err);
            }
            //用新的对象的字段替换掉老对象的字段
            _movie=_.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err)
                }
                console.log(movie._id)

                return res.redirect("/movie/"+movie._id)
            })
        })
    }else{
        _movie=new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function(err,movie){
            if(err){
                console.log(err)
            }
            console.log(movie._id)
            res.redirect("/movie/"+movie._id);
        })
    }
})

app.delete("/admin/list",function(req,res){
    var id=req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err)
            }else{
                res.json({success:1})
            }
        })
    }
})