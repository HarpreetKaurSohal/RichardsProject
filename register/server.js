const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const router = express.Router()
const app = express()

app.use(session({
    secret: 'harpreetjoel',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/views'))

var sess;

