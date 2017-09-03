/**
 * Created by yadi_coco on 2017/8/13.
 */
//编写数据库的模式
var mongoose=require('mongoose');
var MovieSchema=require("../schema/movie")
var Movie=mongoose.model("Movie",MovieSchema)

module.exports=Movie
