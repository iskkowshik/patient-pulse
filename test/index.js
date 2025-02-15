let express=require('express');
let mongoose=require('mongoose');
let app=express();
let bodyParser=require('body-parser');
let path=require('path');
let des=path.join(__dirname,'');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
mongoose.connect('mongodb://localhost:27017/ghmc').then((suc)=>{console.log("db connnected sucsessfully")});

let schema=new mongoose.Schema({name:{type:"string",required:true},rno:{type:"string",required:true}});
let collect=mongoose.model("students",schema);

app.get('/',(req,resp)=>{
    resp.sendFile("C:/Users/admin/nodejs/index.html");
})
app.get('/stud',async (req,resp)=>{
    let data=await collect.find();
    resp.send(data);
    
})
app.post('/pos',async (req,resp)=>{
    let data=req.body;
    console.log(req.body);
    let check=await collect.create({name:req.body.username,rno:req.body.password});
});
app.listen(3018,()=>{
    console.log("server started");
})
