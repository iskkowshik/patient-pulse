const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const app=express();
var nm=require('nodemailer');
const transporter = nm.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'kowshiksaikowshik696@gmail.com',
        pass: 'umzhuqhqbxejmuen'
    }
});
app.use(cookieParser());
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
require('dotenv').config();
app.set('view engine','ejs');
const port=process.env.PORT||5000;
const uri='mongodb+srv://iskkowshik:123kowshik123@cluster0.e2v7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const session=require('express-session')
app.use(session({resave:true,secret:"secret",saveUninitialized:true}));

let patfil=(req,resp,next)=>{
    if(!req.session.patient)
    {  req.session.path=req.path;
        resp.redirect('/patientlogin');
    }
    else{
        next();
    }
}

let docfil=(req,resp,next)=>{
    if(!req.session.doctor)
    {
        resp.redirect('/doctorlogin');
    }
    else{
        next();
    }
}

let adminfil=(req,resp,next)=>{
    if(!req.session.admin)
    {
        resp.redirect('/adminlogin');
    }
    else{
        next();
    }
}
//const admin = require('.adminconn.js');
const patient = require('./patientconn.js');
const doctor = require('./doctorconn.js');
const consult = require('./consultconn.js');




mongoose.connect(uri).then((suc)=>{
    console.log("db conected");
}).catch((err)=>{
 console.log("connection failed");
});





const multer=require('multer');


const ds=multer.diskStorage({
    destination:'uploads/',
    filename:(req,file,cb)=>{
    cb(null,file.originalname)

    }

})
app.use(express.static('public'));
let ds1=multer({storage:ds});

app.get('/',(req,resp)=>{
    resp.render('home');
})

app.get('/doctorsignup',(req,resp)=>{
    let message="";
    resp.render('doctorsignup',{message});
})
app.get('/patientsignup',(req,resp)=>{
    let message="";
    resp.render('patientsignup',{message});
})
app.get('/patientlogin',(req,resp)=>{
    resp.render('patientlogin');
})
app.get('/doctorlogin',(req,resp)=>{
    resp.render('doctorlogin');
})
app.get('/adminlogin',(req,resp)=>{
    resp.render('adminlogin');
})

app.get('/adminhome',async(req,resp)=>{
   let data=await doctor.find({verified:false});
   
    resp.render('adminhome',{data});
})

app.get('/doctoraccept/doc/:id',async(req,resp)=>{
    
    let id=req.params.id;
    let res=await doctor.findByIdAndUpdate({_id:id},{verified:true});
    resp.redirect('/adminhome');

 })
 app.get('/doctordelete/doc/:id',async(req,resp)=>{
    
    let id=req.params.id;
    let res=await doctor.deleteOne({_id:id})
    resp.redirect('/adminhome');

 })
 
   let verifypatient=(req,resp,next)=>{
      
    let token=req.cookies.token;
    if(!token)
    {
        resp.redirect('/patientlogin');
    }
    
    jwt.verify(token,'my-secret-key',(err,user)=>{
        if(user)
        {
            req.user=user;
           // console.log("helllo isk",user);
           next();
        }
    })
    
   }


   let verifydoctor=(req,resp,next)=>{
      
    let token=req.cookies.token;
    if(!token)
    {
        resp.redirect('/doctorlogin');
    }
    
    jwt.verify(token,'my-secret-key',(err,user)=>{
        if(user)
        {
            req.user=user;
           // console.log("helllo isk",user);
           next();
        }
    })
    
   }


app.post('/patientlogin',async(req,resp)=>{

    let email=req.body.email;
    let password=req.body.password;

    let data=await patient.find({email:email,password:password});
    let obj=data[0];
    console.log(obj);
    if(data[0])
    {  let token=jwt.sign({uid:obj._id,role:"patient"},"my-secret-key",{expiresIn:'2h'})
         resp.cookie("token",token);
         resp.redirect('/patienthome/'+obj._id);
        
    }
    else{
        resp.send("invalid user");
    }
});

//app.get('/consultnow',patfil,(req,resp)=>{


//})

app.get('/patienthome/:id',verifypatient,async(req,resp)=>{
    let id=req.params.id
    let obj=await patient.find({_id:id});
       obj=obj[0];
       console.log(obj);
        let data1=await consult.find({patientid:obj._id});
        console.log(obj,data1);

       let data2={obj:obj,data:data1};
       resp.render('patienthome',{data2});
    
    })	



app.post('/doctorlogin',async(req,resp)=>{

    let email=req.body.email;
    let password=req.body.password;

    let data=await doctor.find({email:email,password:password});
    if(data[0]&&data[0].verified==true)
    {  let id=data[0]._id;
        let token=jwt.sign({uid:id,role:"doctor"},"my-secret-key",{expiresIn:'2h'})
        resp.cookie("token",token);
        resp.redirect('/doctorhome/'+id);
        
    }
   
});

app.get('/doctorhome/:id',verifydoctor,async(req,resp)=>{
let id=req.params.id
    id={did:id}
    resp.render('doctorhome',{id});

})

app.get('/doctorconsultants/:id',async(req,resp)=>{

    let id=req.params.id;
    let data2=await consult.find({doctorid:id});
    console.log("future")
    console.log(data2);
    resp.render('doctorconsultants',{data2});

})

app.get('/pastconsultations/:id',async(req,resp)=>{
    let id=req.params.id;
    console.log("past")
    let data2=await consult.find({doctorid:id});
    console.log(data2);
    resp.render('doctorpast',{data2});
})

app.get('/pending-requests/:id',verifydoctor,async(req,resp)=>{
    let id=req.params.id;
    console.log("hey isk",id)
    let data2=await consult.find({doctorid:id});
    console.log(data2);
    resp.render('doctorpending',{data2});
})

app.get('/doctor-slots/:id',(req,resp)=>{
    let id=req.params.id;
    resp.render('doctorslots',{id})
})

app.post('/patientsignup',ds1.single('image'),async(req,resp)=>{
   
    let email=req.body.email;
    let name=req.body.name;
    let password=req.body.password;
    let gender=req.body.gender;
    let phone=req.body.phone;
    let age=req.body.age;
    let img=req.file.originalname;
    let dub=await patient.find({email:email});
    
    if(dub[0])
    { let message='email already registered';
        resp.render('patientsignup',{message});
    }
    else{
        let res=await patient.create({name:name,email:email,password:password,gender:gender,phone:phone,age:age,image:img});
      resp.redirect('/patientlogin');
    }
});
app.post('/doctorsignup',ds1.single('image'),async(req,resp)=>{

    let email=req.body.email;
    let name=req.body.name;
    let password=req.body.password;
    let phone=req.body.phone;
    let city=req.body.city;
    let addr=req.body.addr;
    let gender=req.body.gender;
    let experience=req.body.experience;
    let img=req.file.originalname;
    let special=req.body.special;
    let ex=req.body.ex;
    let price=req.body.price;
    let dub=await doctor.find({email:email});
    if(dub[0])
    {
        let message="email already registered";
        resp.render('doctorsignup',{message});
    }
   else{
    let res=await doctor.create({name:name,email:email,password:password,phone:phone,city:city,address:addr,gender:gender,experience:experience,special:special,image:img,ex:ex,price:price,verified:false});
 resp.redirect('/doctorlogin');
   }
    
});
app.post('/adminlogin',async(req,resp)=>{
 let email=req.body.email;
 let password=req.body.password;
 let dataarr=await admin.find({email:email,password:password});
 if(dataarr[0])
 { req.session.admin=1;
    resp.redirect('/adminhome');
 }
 else{
    resp.send('invalid credentials');
 }

})
//departments
app.get('/cardiology/doc/:pid',verifypatient,async(req,resp)=>{
    console.log("hello cardio");
    let pid=req.params.pid.substring(1);
    let ds=await doctor.find({special:'cardiology',verified:true});
    let data={list:ds,pid:pid};
   
    resp.render('cardiology',{data});
}) 

app.get('/dermatology/doc/:pid',verifypatient,async (req,resp)=>{
    let pid=req.params.pid.substring(1);
    let ds=await doctor.find({special:'dermatology',verified:true});
    let data={list:ds,pid:pid};
    resp.render('dermatology',{data});
})

app.get('/pediatrics/doc/:pid',verifypatient,async (req,resp)=>{
    let pid=req.params.pid.substring(1);
    let ds=await doctor.find({special:'pediatrics',verified:true});
    let data={list:ds,pid:pid};
    resp.render('pediatrics',{data});
})

app.get('/orthopedics/doc/:pid',verifypatient,async (req,resp)=>{
    let pid=req.params.pid.substring(1);
    let ds=await doctor.find({special:'orthopedics',verified:true});
    let data={list:ds,pid:pid};
    resp.render('orthopedics',{data});
})

app.get('/neurology/doc/:pid',verifypatient,async (req,resp)=>{
    let pid=req.params.pid.substring(1);
    let ds=await doctor.find({special:'neurology',verified:true});
    let data={list:ds,pid:pid};
    resp.render('neurology',{data});
})

app.get('/psychiatry/doc/:pid',verifypatient,async (req,resp)=>{
    let pid=req.params.pid.substring(1);
    let ds=await doctor.find({special:'psychiatry',verified:true});
    let data={list:ds,pid:pid};
    resp.render('psychiatry',{data});
})

//department end


app.get('/consult/doc/:did/:pid',verifypatient,async(req,resp)=>{
    let paid=req.params.pid.substring(1);
    let did=req.params.did.substring(1);
    let data={pid:paid,did:did};
    resp.render('symptomform',{data});
    
 


    
})

app.post('/submit/consultation/:pid/:did',async(req,resp)=>{
    let paid=req.params.pid;
    let did=req.params.did;
   // console.log(paid,did)

  let pat=await patient.find({_id:paid})
  let doc=await doctor.find({_id:did});
  pat=pat[0];
  doc=doc[0];
 //console.log(pat,doc);
 
 let res=await consult.create({pname:pat.name,dname:doc.name,patientid:paid,doctorid:did,pgender:pat.gender,phone:pat.phone,age:pat.age,pimage:pat.image,dimage:doc.image,problem:req.body.problem,timing:req.body.timing,notes:req.body.notes,approved:false});
 async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'kowshiksaikowshik696@gmail.com', // sender address
      to: "lohithkumar4248@gmail.com", // list of receivers
      subject: "Hello", // Subject line
      text: "Hello you are doctor?", // plain text body
      html: `<b>Hello you recieved an application from ${[pat.name]}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  async function main1() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'kowshiksaikowshik696@gmail.com', // sender address
      to: "lohithkumar4248@gmail.com", // list of receivers
      subject: "Hello", // Subject line
      text: "Hello you are patient?", // plain text body
      html: `<b>Hello request sucsessfully sent to ${doc.name}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  main().catch(console.error);
  main1().catch(console.error);
resp.redirect('/patienthome'+'/'+paid); 

})
app.get('/acceptapp/:id',verifydoctor,async(req,resp)=>{
 let id=req.params.id;
 
 let arr=await consult.find({_id:id});
 let doc=arr[0];
 let did=arr[0].doctorid;
 let res=await consult.findByIdAndUpdate({_id:id},{approved:true});
 


 async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'kowshiksaikowshik696@gmail.com', // sender address
      to: "lohithkumar4248@gmail.com", // list of receivers
      subject: "Hello", // Subject line
      text: "Hello you are doctor?", // plain text body
      html: `<b>Hello you sheduled a consultation with ${doc.pname} on ${doc.timing}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  
  async function main1() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'kowshiksaikowshik696@gmail.com', // sender address
      to: "lohithkumar4248@gmail.com", // list of receivers
      subject: "Hello", // Subject line
      text: "Hello you are patient?", // plain text body
      html: `<b>your appointment with ${doc.dname} sheduled on ${doc.timing}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  main().catch(console.error);
  main1().catch(console.error);
 
 
 resp.redirect('/doctorhome'+'/'+did);


})
app.get('/rejectapp/:id',verifydoctor,async (req,resp)=>{

    let id=req.params.id;
 
    let arr=await consult.find({_id:id});
    let did=arr[0].doctorid;
    let res=await consult.deleteOne({_id:id});
    resp.redirect('/doctorhome'+'/'+did);

})
app.get('/readarticles',(req,resp)=>{
    resp.render('readarticles');
})

app.get('/consultnow',(req,resp)=>{
    resp.render('patientconsultnow.ejs');
})

app.get('/reshedule/doc/:id',async (req,resp)=>{
    let id=req.params.id;
    let data=await consult.find({_id:id});
    data=data[0];
    let obj={data:data,cid:id}
    

    resp.render('symptomform2',{obj})
})
app.post('/submit/consultation/:cid',async (req,resp)=>{

    let cid=req.params.cid;
    let res1=await consult.find({_id:cid});
    res1=res1[0];
    let pid=res1.patientid;
    let res=await consult.findByIdAndUpdate({_id:cid},{problem:req.body.problem,timing:req.body.timing,notes:req.body.notes})
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'kowshiksaikowshik696@gmail.com', // sender address
          to: "lohithkumar4248@gmail.com", // list of receivers
          subject: "Hello", // Subject line
          text: "Hello you are doctor?", // plain text body
          html: `<b>Hello doctor your consultation with patient  ${res1.pname} got resheduled to ${req.body.timing}</b>`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      async function main1() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'kowshiksaikowshik696@gmail.com', // sender address
          to: "lohithkumar4248@gmail.com", // list of receivers
          subject: "Hello", // Subject line
          text: "Hello you are patient?", // plain text body
          html: `<b>your appointment with ${res1.dname} gpt resheduled to ${req.body.timing}</b>`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      main().catch(console.error);
      main1().catch(console.error);      
    resp.redirect('/patienthome'+'/'+pid)
})
app.get('/viewdetails/:cid',async (req,resp)=>{
 let cid=req.params.cid;
 let data=await consult.find({_id:cid});
 data=data[0];
 console.log(data)
 resp.render('viewdetails',{data});
})
app.get('/backdash/doc/:cid',async(req,resp)=>{
    let cid=req.params.cid;
    let res1=await consult.find({_id:cid});
    let pid=res1[0].doctorid;
    resp.redirect('/doctorhome'+'/'+pid);
})


app.get('/find-doctors',(req,resp)=>{
    resp.render('finddoctors');
})

app.get('/cardiology',async (req,resp)=>{
    console.log("hello cardio");
    
    let data=await doctor.find({special:'cardiology',verified:true});
    
   
    resp.render('cardio2',{data});
}) 

app.get('/dermatology',async (req,resp)=>{
    
    let data=await doctor.find({special:'dermatology',verified:true});
  
    resp.render('dermato2',{data});
})

app.get('/pediatrics',async (req,resp)=>{
    
    let data=await doctor.find({special:'pediatrics',verified:true});
    
    resp.render('pediatri2',{data});
})

app.get('/orthopedics',async (req,resp)=>{
   
    let data=await doctor.find({special:'orthopedics',verified:true});
   
    resp.render('ortho2',{data});
})

app.get('/neurology',async (req,resp)=>{
  
    let data=await doctor.find({special:'neurology',verified:true});
   
    resp.render('neuro2',{data});
})

app.get('/psychiatry',async (req,resp)=>{
   
    let data=await doctor.find({special:'psychiatry',verified:true});
   
    resp.render('psychia2',{data});
})

app.get('/cancel/doc/:cid',async (req,resp)=>{

    let cid=req.params.cid;
    let res1=await consult.find({_id:cid});
    let pid=res1[0].patientid;
    let pname=res1[0].pname;
    let dname=res1[0].dname;
    let timiing=res1[0].timing;
    let res=await consult.deleteOne({_id:cid});
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'kowshiksaikowshik696@gmail.com', // sender address
          to: "lohithkumar4248@gmail.com", // list of receivers
          subject: "Hello", // Subject line
          text: "Hello you are doctor?", // plain text body
          html: `<b>Hello doctor your consultation with patient  ${pname} Sheduled on  ${timing} got Cancelled</b>`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      async function main1() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: 'kowshiksaikowshik696@gmail.com', // sender address
          to: "lohithkumar4248@gmail.com", // list of receivers
          subject: "Hello", // Subject line
          text: "Hello you are patient?", // plain text body
          html: `<b>your appointment with ${dname} on ${timing} Got Cancelled</b>`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      main().catch(console.error);
      main1().catch(console.error);      
    resp.redirect('/patienthome'+'/'+pid)

})



const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')



app.get('/video', (req, res) => {
  res.redirect(`/video/${uuidV4()}`)
})

app.get('/video/:room', (req, res) => {
    console.log(req.params.room);
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

app.post('/searchbar',async (req,resp)=>{
    let city=req.body.city.toLowerCase();
    let special=req.body.specialization.toLowerCase();
    let data=await doctor.find({city:city,special:special,verified:true})
  
    console.log(data);
    resp.render('search.ejs',{data});
    
})



app.listen(5223,()=>{
    console.log('connected sucsessfully');
})
