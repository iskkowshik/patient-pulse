const mongoose=require('mongoose');

let schema=new mongoose.Schema({
    pname:{
        type:"string",
        required:true,
    
    },
    dname:{
        type:"string",
        required:true,
    
    },

    patientid:{
        type:"string",
        required:true,
    
    }, 
    

    
    doctorid:{
        type:"string",
        required:true,
    
    }, 
    pgender:{
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

pimage:{
    type:"string"
},

dimage:{
    type:"string"
},

problem:{
    type:"string"
},

timing:{
 type:"string",
},

notes:{
    type:"string"
},
approved:{
    type:Boolean,
}





})
module.exports=mongoose.model("consult",schema);