const express = require('express');
const app = express();
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.post('/create', (req, res) => {
  const { username, password, age, email } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const createdUser = await userModel.create({
        username,
        password: hash,
        age,
        email,
      })

      const token = jwt.sign({email}, "shhhhhhhhhhhhh");
      res.cookie('token', token);
    
      res.send(createdUser)
    })
  })
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', async (req, res) => {
  const user = await userModel.findOne({email: req.body.email});
  !user && res.send('something is wrong');
  
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if(result) {
      const token = jwt.sign({email: user.email}, "shhhhhhhhhhhhh");
      res.cookie('token', token);
      res.send('You can login now');
    } else {
      res.send('something is wrong');
    }
  })
})

app.get('/logout', (req, res) => {
  res.cookie('token', '')
  res.redirect('/')
})

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000);