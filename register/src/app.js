const express = require("express");
const { findSourceMap } = require("module");
//const router = express.Router();
const path = require("path");
const { URLSearchParams } = require("url");
const app = express();

//session 
var session = require("express-session");
app.use(session({
    secret: 'harpreetjoel',
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({extended:false}))
app.use(express.json());


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);


app.use('/',require('../server'))
//removed all the routes and added to server.js trial for session handling 


app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})