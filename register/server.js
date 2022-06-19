const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const redis = require('redis')
const redisStore = require('connect-redis')(session)
const client = redis.createClient();
const router = express.Router()
const app = express()
let alert = require("alert")

//const mongoose = require("mongoose");
const mongoose = require("./src/db/conn");
//database connection
require("./src/db/conn");
//const mongoose = require("mongoose");
const Register = require("./src/models/userRegister");
const Feedback = require("./src/models/userFeedback");

app.use(session({
    secret: 'harpreetjoel',
    store: new redisStore({host:'localhost', port: 6379, client: client, ttl: 500}),
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/views'))

// var sess;

//routes
router.get("/", (req,res) => {
    res.render("home")
});

router.get("/registration",(req, res) =>{
    res.render("registration.hbs")
});

router.post("/userRegister", async (req,res) =>{
    try {
        const password = req.body.password;
        const conPass = req.body.confirmPass;
        if(password === conPass){
            const registerUser = new Register({
                fullname: req.body.fullname,
                mobileNum: req.body.mobileNum,
                email: req.body.email,
                address: req.body.address,
                password: password,
                confirmPass: conPass
            })

            const registered = await registerUser.save();
            res.status(201).render("login");
        }else{
            alert("Passwords do not match");
        }

    } catch (error) {
        alert("You are already registered.Please login.")
        //res.status(400).send(error);
        
    }
});

router.get("/login",(req,res) =>{
    res.render("login")
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
    /*const tempEmail = req.body.email
    console.log('email from req',tempEmail)
    const singleUser = Register.find((user) => user.email===tempEmail)
    if(!singleUser){
        return res.status(404).send("User does not exist")
    }
    res.status(200).send("Success.. User found")*/
    //check tempEmail from MongoDB
    /*const fname= Register.find(Register.paths.email)
      console.log('this is fname',fname)
    const dbemail = Register.find({'email': req.body.email},(err,user)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            return user
        }
      
    })*/
       
      
    
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
        res.render("contact")
    }
    else{
        res.render("contact")
    }
    
})

router.post("/processFeedback",async(req,res)=>{
    try 
    {
        const fEmail= req.body.email
        const fName = req.body.name
       const subject = req.body.subject
       const message = req.body.message
       console.log(subject)
       console.log(message)
            const registerFeedback = new Feedback({
            fName:req.body.name,
            fEmail:req.body.email,
            subject: req.body.subject,
            message: req.body.message
         })

         const feedbackSaved = await registerFeedback.save();
         if(req.session.email)
         {
            res.status(201).render(newHome)
         }
         else
         {
            res.status(201).redirect("/home")
         }
         
         alert("thank your for your feedback")
        
    } 
    catch (error) 
    {
        alert("your feedback not  sent");
        console.log(error)
    }
})


module.exports = router