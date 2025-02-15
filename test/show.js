const express=require('express');
const router=express.Router();
let dbs=require('./user');
router.get('/',async(req,resp)=>{
   let data=await dbs.find();

    resp.render('show',{data});
})
module.exports=router;