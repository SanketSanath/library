const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(express.static(__dirname+'/../public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');


//ho-me route
app.get('/', (req, res)=>{
	res.render('login.ejs', {title: "Login"});
});

app.post('/admin/login', (req, res)=>{
	var user_id = req.body.admin_id;
	var password = req.body.password;
	console.log(user_id, password);
	con.query("SELECT * FROM users WHERE user_id="+mysql.escape(user_id)+" AND password="+mysql.escape(password), function (err, result, fields) {
		if(err)
			throw err;
		console.log(result);
		if(typeof result=='undefined'|| result.length==0) {
			console.log('error');
			res.status(500).send('Invalid credentials')
		}
		else {
			console.log(result[0].type);
			if(result[0].type==1)
				res.send("Done");
			else
				res.status(500).send('Given credentials are not of admin')

		}
	});
});

app.post('/user/login', (req, res)=>{
	var user_id = req.body.user_id;
	var password = req.body.password;
	console.log(user_id, password);
	con.query("SELECT * FROM users WHERE user_id="+mysql.escape(user_id)+" AND password="+mysql.escape(password), function (err, result, fields) {
		if(err)
			throw err;
		console.log(result);
		if(typeof result=='undefined'|| result.length==0) {
			console.log('error');
			res.status(500).send('Invalid credentials')
		}
		else {
			console.log(result[0].type);
			if(result[0].type==2)
				res.send("Done");
			else
				res.status(500).send('Given credentials are not of user')

		}
	});
});

app.get('/admin/dashboard', (req, res)=>{
	console.log(req.body.user_id)
	res.render('admin_dashboard.ejs', {title: "Admin"});
});

app.get('/user/dashboard', (req, res)=>{
	console.log(req.body.user_id)
	res.render('user_dashboard.ejs', {title: "User"});
});

app.listen(3000, ()=>{
	console.log('server is running');
});


var con = mysql.createConnection({
  host: "localhost",
  user: "developer",
  password: "password",
  database: "library"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});