/**
 * Created by yadi_coco on 2017/9/5.
 */
var mongoose=require("mongoose");
//拿到电影的schema
var Schema=mongoose.Schema
var ObjectId = Schema.Types.ObjectId
//定义数据库模式
var CommentSchema=new mongoose.Schema({
    movie:{
        type:ObjectId,
        ref:"Movie"
    },
    from:{
        type:ObjectId,
        ref:"User"
    },
    to:{
        type:ObjectId,
        ref:"User"
    },
    //相关联的评论
    reply:[{
        from:{
            type:ObjectId,
            ref:"User"
        },
        to:{
            type:ObjectId,
            ref:"User"
        },
        content:String
    }],
    content:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

//在数据保存之前进行的操作
CommentSchema.pre("save",function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt=Date.now()
    }
    //执行完上面的操作，还要再next()才会把保存的动作执行下去
    next()
})

//这是定义模块中的静态方法，fetch是取出所有数据并进行排序
CommentSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)

    }
}
//这是模式的模块导出
module.exports=CommentSchema



