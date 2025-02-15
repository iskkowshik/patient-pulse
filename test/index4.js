const express=require('express');
const session=require('express-session');
const app=express();
app.use(session({secret:"secret",resave:true,saveUninitialized:true}));
app.use((req,resp,next)=>{
    if(req.session.user)
    {
        resp.sendFile('C:/Users/admin/nodejs/index.html');
    }
    next();
})
app.get('/hello',(req,resp)=>{
    req.session.user=1;
    resp.send("helllo world");
})
app.listen(5001,()=>{
    console.log("server started");
})