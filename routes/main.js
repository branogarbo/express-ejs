let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let bcrypt = require('bcryptjs');
let env = require('dotenv');
let dburl = process.env.DB_URL;

env.config();

let router = express.Router(); // creating router object

router.use((req,res,next)=>{
	console.log(req.method,req.url);

	next();
});

router.get('/', (req,res)=>{
	res.redirect('/login');
});

router.post('/login', (req, res)=>{
	({username, password} = req.body);

	if (username && password) {
		MongoClient.connect(dburl, (err,client)=>{

         client.db('name-collect').collection('users').find({user: username}).toArray(async (err,user)=> {
				if (user.length > 0) {
               let isMatch = await bcrypt.compare(password, user[0].pass);
				
					if (isMatch) {
                  req.session.loggedin = true;
						req.session.username = username;
						res.redirect('/home');
					}
					else {
                  res.send('Incorrect username and/or password');
					}
				}
				else {
               res.send('Incorrect username and/or password');
				}
				
				client.close();
			});
         
		});
	}
	else {
      res.send('Please provide your username and password');
	}
   
});

router.post('/signup', (req,res)=>{
   ({username, password} = req.body);

	if (username && password) {
      MongoClient.connect(dburl, (err,client)=>{
         
         client.db('name-collect').collection('users').find({user: username}).toArray(async (err,results)=> {
            if (results.length > 0) {
               res.send('This username has already been taken');
				}
				else {
               let hashedPass = await bcrypt.hash(password,10);
					
					client.db('name-collect').collection('users').insertOne({user: username, pass: hashedPass});
					req.session.loggedin = true;
					req.session.username = username;
					res.redirect('/home');
				}
				
				client.close();
			});
         
		});
	}
	else {
      res.send('Please provide your username and password');
	}
	
});

router.get('/login', (req, res)=>{
   res.render('pages/form', {
      title: 'Log In',
      postRoute: '/login',
      linkmsg: `Don't have an account? <a href="/signup">sign up</a>`
   });
});

router.get('/signup', (req,res)=>{
   res.render('pages/form', {
      title: 'Sign Up',
      postRoute: '/signup',
      linkmsg: `Already have an account? <a href="/login">log in</a>`
   });
});

router.get('/home', (req, res)=>{
	if (req.session.loggedin) {
		res.send(`Welcome back, ${req.session.username}!`);
	} else {
		res.send('Please login to view this page!');
	}
});

module.exports = router; // saying that we are exporting the router object (with all its route handlers)