let express = require('express');
let path = require('path');
let port = 3000;

let app = express();

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.listen(port, console.log(`listening on port ${port}`));

app.get('/login', (req,res)=>{
   res.render('pages/form', {
      title: 'Log In',
      lnkmsg: `Don't have an account? <a href="/signup">sign up</a>`
   });
})

app.get('/signup', (req,res)=>{
   res.render('pages/form', {
      title: 'Sign Up',
      lnkmsg: `Already have an account? <a href="/login">log in</a>`
   });
})