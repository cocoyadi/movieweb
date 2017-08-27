/**
 * Created by yadi_coco on 2017/8/28.
 */
//编写数据库的模式
var mongoose=require('mongoose');
var UserSchema=require("../schema/user")
var User=mongoose.model("User",UserSchema)

module.exports=User

