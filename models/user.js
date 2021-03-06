var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");

var userschema=new mongoose.Schema({
    username:String,
    password:String,
    todos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"todos"
        }
    ],
});

userschema.plugin(passportlocalmongoose);
module.exports=mongoose.model("User",userschema);