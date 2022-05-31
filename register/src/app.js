const express = require("express");
const path = require("path");
const app = express();

require("./db/conn");
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
    res.render("index")
});

app.get("/registration",(req,res) =>{
    res.render("registration")
});

app.post("/userRegister", async (req,res) =>{
    try {
        const password = req.body.password;
        const conPass = req.body.confirmPass;
        if(password=== conPass){
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

/*app.get("/login",(req,res) =>{
    res.render("login")
});*/

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})