const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const session=require('express-session');

require('dotenv').config();
//const session=require('express-session');
const app=express();
const port=process.env.PORT||5000;
const uri=process.env.DB_URI;

app.use(session({secret:"secret",resave:true,saveUninitialized:true}));


mongoose.connect(uri).then((suc)=>{
    console.log("db conected");
}).catch((err)=>{
 console.log("connection failed");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','ejs');
let user=require('./user.js');
let route=require('../route.js');
let home=require('../show.js');

app.use('/user',route);
app.use('/show',home);


app.listen(port,()=>{
    console.log("server started");
})