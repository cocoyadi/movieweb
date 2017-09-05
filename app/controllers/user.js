/**
 * Created by yadi_coco on 2017/9/4.
 * 处理用户相关的业务
 */
var User=require("../modeljs/user");

// midware for user 登录用的中间件
//需要登录状态(这里对书写的规范性要求非常严格)
exports.signinRequired = function(req,res,next){
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();
};


//需要管理员状态
exports.adminRequired = function(req,res,next){
    var user = req.session.user;
    if(user.role <= 10){
        return res.redirect('/signin');
    }
    next();
};

//展示注册页面
exports.showSignup=function(req,res){
    res.render("signup",{
        title:"注册页面"
    })
}

//注册
exports.signup=function(req,res){
    var _user=req.body.user;
    //判断是否已经注册
    User.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(user){
            return res.redirect("/showSignin")
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
}

//展示登陆页面
exports.showSignin=function(req,res){
    res.render("signin",{
        title:"登陆页面"
    })
}

//登陆
exports.signin= function(req,res){
    var _user=req.body.user;
    var name=_user.name;
    var password=_user.password;
    //去users数据库查询用户名为name的数据，如果有就执行比对密码的方法
    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err)
        }
        //用户名不存在时，跳转到首页
        if(!user){
            return res.redirect("/showSignup")
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
                return res.redirect("/showSignin")
                console.log("Password is not matched")
            }
        })
    })
}


//退出登录
exports.logout=function(req,res){
    delete req.session.user;
    delete res.locals.user;
    res.redirect("/")
}


//用户列表页
exports.userlist=function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err);
        }
        res.render("userlist",{
            title:"用户列表页",
            users:users
        })
    })





}