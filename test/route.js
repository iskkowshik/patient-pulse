const express=require('express');
const router=express.Router();
const dbs=require('./user.js');
const bodyParser=require('body-parser');

router.get('/',(req,resp)=>{
    req.session.user=1;
    resp.render('signup')
});

router.get('/update/:_id',async (req,resp)=>{
    let id=req.params._id;
    let dataarr=await dbs.find({_id:id});
    data=dataarr[0];
   // console.log(dataarr[0]);
    resp.render('edit',{data});
})
router.post('/post',async(req,resp)=>{
     
  
    let res=await dbs.create({email:req.body.email,password:req.body.password});
 resp.redirect('/show');
})
router.post('/update/:id',async(req,resp)=>{
   let id=req.params.id;
   let res=await dbs.findByIdAndUpdate({_id:id},{email:req.body.email,password:req.body.password});
   console.log(req.body);

  resp.redirect('/show');
})


module.exports=router;