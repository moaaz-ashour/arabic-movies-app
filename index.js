const express = require('express');
const app = express();
const pg = require('spiced-pg');
const password = require('./config.json');
const dbase = process.env.DATABASE_URL || pg('postgres:' + password.dbUser + ":" + password.dbPassword + "@localhost:5432/movies");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const hashPassword = require('./password/checking-hashing').hashPassword;
const checkPassword = require('./password/checking-hashing').checkPassword;


if (process.env.NODE_ENV != 'production') {
   app.use(require('./webpack.config.js'));
}

app.use(cookieParser());
app.use(cookieSession({
   secret: process.env.SESSION_SECRET || 'Arabic Movies!',
   maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


app.get('/checkSignedUpOrIn', (req, res) => {
   if (req.session.user){
      res.json({
         loggedIn: true,
         email: req.session.user.email
      })
   } else {
      res.json({
         loggedIn: false,
      })
   }
});


app.post('/signup', (req, res) => {
   const {username, email, password} = req.body;
   hashPassword(password).then((hashedPass) => {
      const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
      const params = [username, email, hashedPass];
      const fillUsersTable = dbase.query(query, params);
      fillUsersTable.then((data) => {
         req.session.user = {
            id: data.rows[0]['id'],
            email: email
         }
         res.json({
            success: true
         })
      }).catch((err) => {
         res.json({
            success: false,
            emailExistsInDb: 'Email already exists! Please try to login.'
         })
      });
   })
})


app.post('/signin', (req, res) => {
   const {email, password} = req.body;
   const query = 'SELECT id, email, password FROM users WHERE email=$1';
   const params = [email];
   const getPass = dbase.query(query, params);
   getPass.then((data) => {
      if (data.rows.length === 0){
         res.json({
            emailSuccess: false,
            emailNotExist: 'Email does not exist!'
         })
      } else {
         const userId = data.rows[0]['id'];
         const dbPass = data.rows[0]['password'];
         const checkPass = checkPassword(password, dbPass);
         checkPass.then((data) => {
            if (data === true){
               req.session.user = {
                  userId,
                  email
               }
               res.json({
                  passSuccess: true,
                  emailSuccess: true
               })
            } else if (data === false){
               res.json({
                  passSuccess: false,
                  wrongPass: "Wrong Password!"
               })
            }
         })
      }
   }).catch((err) => {
      console.log(err);
   });
})


app.post('/profileUpdateEmail', (req, res) => {
   const {email} = req.body;
   const userId = req.session.user.userId;
   const updateEmailQuery = 'UPDATE users SET email=$1 WHERE id=$2';
   const updateEmailParams = [email, userId];
   const updateEmail = dbase.query(updateEmailQuery, updateEmailParams);
   updateEmail.then((data) => {
      req.session = null;
      res.json({
         emailUpdated: true,
         loggedOut: true,
         emailUpdatedMsg: "Your Email has been updated successfully! Please try to login again "
      })
   }).catch((err) => {
      console.log(err);
      res.json({
         success: false,
         emailExistsInDb: 'Email already exists in our database!'
      })
   });
})

app.post('/profileUpdatePassword', (req, res) => {
// password not an empty string check
   const {password} = req.body;
   const userId = req.session.user.userId;
   hashPassword(password).then((hashedPass) => {
      const query = 'UPDATE users SET password=$1 WHERE id=$2';
      const params = [hashedPass, userId];
      const updatePassword = dbase.query(query, params);
      updatePassword.then((data) => {
         req.session = null;
         res.json({
            passUpdated: true,
            loggedOut: true,
            passUpdatedMsg: "Password Updated! Please login again "
         })
      }).catch((err) => {
         console.log(err);
      });
   })
})

app.get('/logout', (req,res) => {
   req.session = null;
   res.json({
      loggedOut: true
   })
});

app.get("*", (req, res) => {
   res.sendFile(__dirname + "/public/index.html");
});

app.use( function errorHandler (err, req, res, next) {
   if (res.headersSent) {
     return next(err);
   }
   res.status(500).send("Something went wrong! Maybe you have to register or login to see this page.");
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server is running on localhost:8080');
});
