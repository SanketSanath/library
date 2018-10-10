const express = require('express');
const bodyParser = require('body-parser');

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
	res.send('hello baby');
});

app.get('/admin/dashboard', (req, res)=>{
	res.render('admin_dashboard.ejs', {title: "Admin"});
});

app.listen(3000, ()=>{
	console.log('server is running');
});