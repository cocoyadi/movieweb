/**
 * Created by yadi_coco on 2017/8/13.
 */
var mongoose=require("mongoose");
//定义数据库模式
var MovieSchema=new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:String,
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
MovieSchema.pre("save",function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt=Date.now()
    }
    //执行完上面的操作，还要再next()才会把保存的动作执行下去
    next()
})

//这是定义模块中的静态方法，fetch是取出所有数据并进行排序
MovieSchema.statics={
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
module.exports=MovieSchema

