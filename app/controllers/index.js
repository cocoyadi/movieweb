/**
 * Created by yadi_coco on 2017/9/4.
 * 负责和首页进行交互
 */
var Movie=require("../modeljs/movie");

exports.index=function(req,res){
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
