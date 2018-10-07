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

app.listen(3000, ()=>{
	console.log('server is running');
})