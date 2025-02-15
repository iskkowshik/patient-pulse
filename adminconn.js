const mongoose=require('mongoose');

let schema=new mongoose.Schema({
     

email:{
    type:"string",
    required:true,

},
password:{
    type:"string",
    required:true,
}


})
module.exports=mongoose.model("admin",schema);