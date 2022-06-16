const express = require("express");
const { findSourceMap } = require("module");
const router = express.Router();
const path = require("path");
const { URLSearchParams } = require("url");
const app = express();



//const mongoose = require("mongoose");
const mongoose = require("./db/conn");
//database connection
require("./db/conn");
//const mongoose = require("mongoose");
const Register = require("./models/userRegister");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);

app.get("/", (req,res) => {
    res.render("home")
});

app.get("/registration",(req, res) =>{
    res.render("registration.hbs")
});

//app.get("/registration", registrationRequestArrived);
//
//function registrationRequestArrived(req, res)
//{ 
//    res.render("registration");
//}

app.post("/userRegister", async (req,res) =>{
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
            res.send("passwords do not match");
            
        }

    } catch (error) {
        res.status(400).send(error);
        
    }
});

app.get("/login",(req,res) =>{
    res.render("login")
});

app.post("/userLogin",async(req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password

        const useremail = await Register.findOne({email:email});
        
        if(useremail.password === password)
        {
            res.status(201).render("home")
        }
        else{
            res.send("Password is not matching")
        }
    }
    catch(error)
    {
        res.status(400).send("Inavalid email")
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

app.get("/aboutUs",(req,res)=>{
    res.render("aboutUs")
})
/*app.get("/booking",(req,res,next) =>{
    Register.find((err,docs) => {
        if(!err) {
            res.render("booking");
        }
        else{
            res.render("registration");
        }
    });
});*/

app.get("/home",(req,res) =>{
    res.render("home")
});

app.get("/about",(req,res) =>{
    res.render("aboutUs")
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})