/**
 * Created by yadi_coco on 2017/9/5.
 */
//编写数据库的模式
var mongoose=require('mongoose');
var CommentSchema=require("../schema/comment")
var Comment=mongoose.model("Comment",CommentSchema)

module.exports=Comment

