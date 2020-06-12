var mongoose=require("mongoose");

var todoschema=new mongoose.Schema({
    todo:String
});

module.exports=mongoose.model("todos",todoschema);
