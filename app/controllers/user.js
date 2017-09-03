/**
 * Created by yadi_coco on 2017/9/4.
 * 处理用户相关的业务
 */
var User=require("../modeljs/user");

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
    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err)
        }
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

    //需要登录状态
    exports.signinRequired = function(req,res,next){
        var user=req.session.user;
        if(user){
            return res.redirect("/showSignin");
        }
        next();
    }

    //需要管理员状态
    exports.adminRequired = function(req,res,next){
        var user=req.session.user;
        if(!user||user.role<50){
            return res.redirect("/showSignin");
        }
        next();
    }

}