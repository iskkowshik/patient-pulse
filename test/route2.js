let express=require('express');
let router=express.Router();

router.get('/',(req,resp)=>{
    resp.send("user only");
})
router.get('/user',(req,resp)=>{
    resp.send("user+user");
})

module.exports=router;

