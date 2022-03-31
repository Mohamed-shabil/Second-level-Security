//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require('mongoose');
const {Schema} = mongoose;
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser: true});

const userSchema= new mongoose.Schema({
    email:String,
    password:String
})
 
  
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
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            newUser= new User({
                email: req.body.username,
                password:hash
            })
            newUser.save((err)=>{
                if (err) {
                    console.log(err);
                }else{
                    res.render('secrets')
                }
            }); 
        });
    });  
})
app.post('/login',(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},(err,foundUser)=>{
        if (err) {
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password,foundUser.password,function(err, result) {
                    if(result === true){
                        res.render('secrets');
                    }
                });
            }
        }
    })
})

app.listen(3000,() =>{
    console.log('listening on port 3000')
})