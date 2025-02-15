const express=require('express');

const app=express();

const multer=require('multer');
let path=require('path');

const ds=multer.diskStorage({
    destination:'uploads/',
    filename:(req,file,cb)=>{
    cb(null,Date.now()+file.originalname)

    }

})
app.use(express.static('./uploads'));
let ds1=multer({storage:ds});
 app.get('/upload',(req,resp)=>{
    resp.sendFile('C:/Users/admin/nodejs/index.html');
 })
app.post('/upload',ds1.single('image'),(req,resp)=>{
 resp.send('uploaded sucsessfullyy');
});

app.get('/get',(req,resp)=>{
  resp.sendFile(path.join(__dirname,'uploads')+'/1731349723097IMG_20210506_194440 (2).jpg');
  //resp.send("hello");
});


app.listen(1212,()=>{
    console.log('server connected sucsessfully');
});