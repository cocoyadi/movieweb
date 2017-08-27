/**
 * Created by yadi_coco on 2017/8/28.
 */
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
//计算强度
var SALT_WORK_FACTOR=10;
//定义数据库模式
var UserSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    password:String,
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
UserSchema.pre("save",function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }else{
        this.meta.updateAt=Date.now()
    }
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
       if(err) return next(err);
        bcrypt.hash(user.password,salt,function(err,hash){
           if(err) return next(err);
           user.password=hash;
           //执行完上面的操作，还要再next()才会把保存的动作执行下去
           next()
       })
    });
})

//实例方法(cb是一个封装的数据类型)
UserSchema.methods={
    comparePassword:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err) return cd(err);
            cb(null,isMatch)
        })
    }
}


//这是定义模块中的静态方法，fetch是取出所有数据并进行排序
UserSchema.statics={
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
module.exports=UserSchema


