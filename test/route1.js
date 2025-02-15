let express=require('express')
let router=express.Router();

router.get('/',(req,resp)=>{
    resp.send("product only");
})
router.get('/product',(req,resp)=>{
    resp.send("product +product");
})


module.exports=router;