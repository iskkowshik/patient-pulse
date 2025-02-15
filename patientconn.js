const mongoose=require('mongoose');

let schema=new mongoose.Schema({
    name:{
        type:"string",
        required:true,
    
    },
     
email:{
    type:"string",
    required:true,

},
password:{
    type:"string",
    required:true,
},
gender:{
    type:"string",
    required:true,
},
phone:{
    type:"string",
    required:true,

},
age:{
    type:"string",
    required:true,
},
image:{
    type:"string",
}


})
module.exports=mongoose.model("patient",schema);