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
phone:{
    type:"string",
    required:true,

},
city:{
    type:"string",
    required:true,
},

address:{
type:"string",
required:true,
}
,
gender:{
    type:"string",
    required:true, 
}
,
experience:{
    type:"string",
    required:true,
},
special:{
    type:"string",
    required:true,
},
image:{
    type:"string"
},
ex:{
    type:"string",
    required:true,
},

price:{
    type:"string",
    
},

verified:{
    type:Boolean,
}


})
module.exports=mongoose.model("doctor",schema);