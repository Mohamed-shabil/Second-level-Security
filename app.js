//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const {Schema} = mongoose;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser: true});

const userSchema= new mongoose.Schema({
    email:String,
    password:String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model('user',userSchema);


app.get('/', (req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})
  

app.post('/register', (req, res) => {
    newUser= new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err)=>{
        if (err) {
            console.log(err);
        }else{
            res.render('secrets')
        }
    });
})
app.post('/login',(req, res)=>{
    User.findOne({email: req.body.username},(err,foundUser)=>{
        if (err) {
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render('secrets')
                }
                else{
                    console.log('Wrong');
                  res.send('pls register');
                }
            }
        }
    })
})

app.listen(3000,() =>{
    console.log('listening on port 3000')
})