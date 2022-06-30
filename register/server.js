const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const redis = require('redis')
const redisStore = require('connect-redis')(session)
const client = redis.createClient();
const router = express.Router()
const app = express()
let alert = require("alert")

//email handler
const nodemailer = require('nodemailer');

//const mongoose = require("mongoose");
const mongoose = require("./src/db/conn");
//database connection
require("./src/db/conn");
//const mongoose = require("mongoose");
const Register = require("./src/models/userRegister");
const Feedback = require("./src/models/userFeedback");
const UserOTPVerification = require("./src/models/UserOTPVerification");
const ProductWine = require("./src/models/productWine");
const ProductRum = require("./src/models/productRum");
const ProductPlain = require("./src/models/productPlain");


//uqique string
const{v4: uuidv4} = require("uuid");
const { isBoolean, result } = require('lodash')
const { callbackPromise } = require('nodemailer/lib/shared')
//const UserOTPVerification = require('./src/models/UserOTPVerification')

//env var
require("dotenv").config();

app.use(session({
    secret: 'harpreetjoel',
    store: new redisStore({host:'localhost', port: 6379, client: client, ttl: 500}),
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/views'))

    
//nodemailer transpoter
let transpoter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user:"joelpatole4@gmail.com",
        pass:"sohpkcehmqvnoztg",
    }
})

//testing suceess
transpoter.verify((error,success)=>{
    if(error){
        console.log('error in mail connection')
        console.log(error)
    }else{
        console.log("ready for message")
        console.log(success)
    }
})
// var sess;

//routes
router.get("/", (req,res) => {
    res.render("home")
});

router.get("/registration",(req, res) =>{
    res.render("registration.hbs")
});



//verify otp click should take the control to /userRegistration
router.post("/userRegister", async (req,res) =>{
    console.log("/userRegister reached.")
    try 
    {

        //db madhun UserOTPVerification collection madhun OTP retrive kar 
        //ani check kar with req.otp if == then do the registration part
        

           const email=req.body.email;
           const password = req.body.password;
           const conPass = req.body.confirmPass;
            if(password === conPass)
            {
              const registerUser = new Register({
                fullname: req.body.fullname,
                mobileNum: req.body.mobileNum,
                email: req.body.email,
                address: req.body.address,
                password: password,
                confirmPass: conPass,
                verified:false})
                
                const userDetails = await Register.findOne({email:email});
                console.log('entered email is, ',email)
               //console.log('user wala email is, ',userDetails.email)
                if(userDetails)
                {
                   alert('Email alredy registered, please login')
                   res.render("login.hbs")
                }
                else
                {
                          //if(opt == res.otp)
                         const registered = await registerUser.save()
                        .then((result)=>{
                        //handle account verification 
                        console.log("trying to save reg data.", result);
                        //(result,res);
                        sendVerificationEmail(req.body.email,res,registerUser._id)
                        //res.status(201).render("login")
                
                         })
                        .catch((err)=>{
                        console.log(err)
                        res.json({
                            err,
                            status:"failed",
                            message:"an error occured while saving"
                        })
                        })
                }
            
              //res.status(201).render("login");
              //else wrong otp
             }
             else 
             {
               alert("Passwords do not match");
             }

            //send otp to mail logic
                        


    }//try ends 
     catch (error) 
    {
    alert("You are already registered.Please login.")
        //res.status(400).send(error);
    }
     
});



const sendVerificationEmail = (email,res,_id)=>{
    //url to be used in email
    console.log("inside sendVerificationEmail()");
   
    const currentUrl = "http.//localhost:3000/";
    const uniqueString = uuidv4() + _id;
    
     //otp creation
     var num = Math.random()*9999
     OTP=(Math.floor(num));
     console.log(OTP)

    const mailOptions = {
        from:"joelpatole4@gmail.com",
        to:email,
        subject:"Verify your email",
        html:`<p>Verify your Email address to compelete the signup process</p><p>This OTP <b>expires in 1 hour.</b></p>
              <p> <b>OTP: ${OTP}</b></p>`,
        //html:`<p>Verify your Email address to compelete the signup process</p><p>This link <b>expires in 1 hour.</b></p>
        //      <p> <a href=${currentUrl+"user/verify/"+_id+"/"+uniqueString}>Press</a> to proceed.</p>`,
    }

    const UOV = new UserOTPVerification({
        userID:_id,
        //uniqueString:
        email:email,
        otp:OTP,
        createdAt:Date.now(),
        expiresAt:Date.now() + 600000,

    })
    console.log("sendVerificationEmail Entered ", _id , " ",email);
    UOV
    .save()
    .then(()=>{
        transpoter.sendMail(mailOptions)
        .then(()=>{
            console.log("Email Sent.");
            res.status(201).render("OTP",{email:email});
            
            console.log("sucess in data entry")
                        
            /*res.json({
                status:"Pending",
                message:"otp sent"
            })*/
            return OTP
        })
        .catch((error)=>{
            console.log(error)
                var myquery={email:email}
                Register.deleteOne(myquery,(err,obj)=>{
                if(err) throw err
                 console.log("user-Data deleted")
                })
            res.json({
                status:"failed",
                message:"error in sending otp"
            })
            //return false
        })
        
    })
    .catch((error)=>{
        var myquery={email:email}
        Register.deleteOne(myquery,(err,obj)=>{
        if(err) throw err
            console.log("user-Data deleted")
        })
        console.log(error)
        //return false
    })
}

router.get("/login",(req,res) =>{
    res.render("login")
});

router.get("/otp",(req,res) =>{
    res.render("OTP",{email:req.body.email})
});

router.post("/userLogin",async(req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password

        const userDetails = await Register.findOne({email:email});
        
        if(userDetails.password === password)
        {
            sess = req.session
            sess.name = userDetails.fullname
            sess.email = userDetails.email
            //console.log(sess)
            res.status(201).render("newHome",{name:sess.name})
        }
        else{
            alert("Password is not matching")
        }
    }
    catch(error)
    {
        alert("Inavalid email")
    }
})

router.post("/newHome",(req,res)=>{
    res.render("newHome")
})

router.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.redirect("/home")
    })
})

router.get("/aboutUs",(req,res)=>{
    if(req.session.email){
        res.render("aboutUs",{name:req.session.name})
    }
    else{
        res.render("aboutUs")
    }
})

router.get("/home",(req,res) =>{
    if(req.session.email){
        res.render("newHome",{name:req.session.name})
    }
    else{
        res.render("home")
    }
});

router.get("/about",(req,res) =>{
    res.render("aboutUs")
});

router.get("/contact",(req,res)=>{
    if(req.session.email)
    {
        res.render("contact",{name:req.session.name})
    }
    else{
        res.render("contact")
    }
    
})

router.post("/processFeedback",async(req,res)=>{
    try 
    {
    //     const fEmail= req.body.email
    //     const fName = req.body.name
    //    const subject = req.body.subject
    //    const message = req.body.message
    //    console.log(subject)
    //    console.log(message)
            const registerFeedback = new Feedback({
            fName:req.body.name,
            fEmail:req.body.email,
            subject: req.body.subject,
            message: req.body.message
         })

         const feedbackSaved = await registerFeedback.save();
         if(req.session.email)
         {
            res.status(201).render("newHome", {name:req.session.name})
         }
         else
         {
            res.status(201).redirect("/home")
         }
         
         alert("thank your for your feedback")
        
    } 
    catch (error) 
    {
        alert("Your feedback not  sent");
        console.log(error)
    }
})
router.get("/menu",(req,res) =>{
    if(req.session.email)
    {
        res.render("menu",{name:req.session.name})
    }
    else{
        res.render("menu")
    }
    
});
router.get("/wineCake",(req,res) =>{
    ProductWine.find(function(err,docs){
        var productChunks = [];
        var chunkSize = 2;
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
        }
        if(req.session.email)
        {
            res.render("wineCake",{name:req.session.name,products:productChunks})
        }
        else{
            res.render("wineCake",{products:productChunks})
        }
    });
    // if(req.session.email)
    // {
    //     res.render("wineCake",{name:req.session.name,products:products})
    // }
    // else{
    //     res.render("wineCake",{products:products})
    // }
    
});
router.get("/rumCake",(req,res) =>{
    ProductRum.find(function(err,docs){
        var productChunks = [];
        var chunkSize = 2;
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
        }
        if(req.session.email)
        {
            res.render("rumCake",{name:req.session.name,products:productChunks})
        }
        else{
            res.render("rumCake",{products:productChunks})
        }
    });
    
});
router.get("/plainCake",(req,res) =>{
        ProductPlain.find(function(err,docs){
        var productChunks = [];
        var chunkSize = 2;
        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
        }
        if(req.session.email)
        {
            res.render("plainCake",{name:req.session.name,products:productChunks})
        }
        else{
            res.render("plainCake",{products:productChunks})
        }
    });

});

router.post("/verifyOtp" ,async(req,res)=>{
    const otp = req.body.otp
    const email = req.body.email
    console.log(email)
    console.log(otp)
    const userOtpDetails = await UserOTPVerification.findOne({otp:otp});
    console.log(userOtpDetails)
    if(userOtpDetails)
    {
        if(userOtpDetails.expiresAt-userOtpDetails.createdAt > 600000)
        {
           alert('timeOut')
           var myquery={otp:otp}
            UserOTPVerification.deleteOne(myquery,(err,obj)=>{
                 if(err) throw err
                 console.log("otp-Data deleted")
            })
           var myquery={email:email}
            Register.deleteOne(myquery,(err,obj)=>{
                 if(err) throw err
                 console.log("user-Data deleted")
            })
        }
        else
        {
            console.log(userOtpDetails)
            alert("OTP Verified.")
            res.render("login.hbs")
            var myquery={otp:otp}
            UserOTPVerification.deleteOne(myquery,(err,obj)=>{
                 if(err) throw err
                 console.log("otp-Data deleted")
            })

        }
        
    }
    else{
        alert('wrong otp')
        console.log("wrong otp")

        var myqueryotp= {email:email}
        console.log(myqueryotp)
            UserOTPVerification.deleteOne(myqueryotp,(err,obj)=>{
                 if(err) throw err
                 console.log("otp-Data deleted")
            })
        var myqueryuser={email:email}
            Register.deleteOne(myqueryuser,(err,obj)=>{
                 if(err) throw err
                 console.log("user-Data deleted")
            })
        res.render("registration")
        
    }
    
})


module.exports = router