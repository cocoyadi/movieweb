/**
 * Created by yadi_coco on 2017/9/4.
 * 负责处理电影有关的业务请求
 */

var Movie=require("../modeljs/movie");
var Comment=require("../modeljs/comment");

//替换旧的字段
var _=require("underscore");

//电影详情页
exports.detail=function(req,res){
    var id=req.params.id;
    //这里面res渲染了两次，是不被允许的，
    // 一次请求只能使用一次res.render(渲染，为了以防外一，建议res一定要加上return)
    Movie.findById(id,function(err,movie){
        //获取电影评论(包括评论的用户信息)
        Comment
            .find({movie:id})
            .populate('from','name')
            .exec(function(err,comments){
                //渲染detail页面
                res.render("detail",{
                    title:movie.title,
                    movie:movie,
                    comments:comments
                })
            })
    })
}


//新增电影详情页
exports.new=function(req,res){
    res.render("admin",{
        title:"电影详情后台录入页",
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
}


//更新电影详情
exports.update=function(req,res){
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
}

//对操作进行保存
exports.save=function(req,res){
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
}


//电影列表页
exports.list=function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render("list",{
            title:"列表页",
            movies:movies
        })
    })
}


//删除电影记录
exports.delete=function(req,res){
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
}