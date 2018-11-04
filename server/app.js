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

app.post('/add_book',(req,res)=> {
	var book_isbn = req.body.book_isbn;
	var book_name = req.body.book_name;
	var book_author = req.body.book_author;
	var book_q = req.body.book_q;
	con.query("SELECT * FROM books WHERE isbn="+mysql.escape(book_isbn), function (err, result, fields) {
		if(err)
			throw err;
		if(typeof result == 'undefined' || result.length==0) {
			var items=0;
			con.query("INSERT INTO books values ("+mysql.escape(book_isbn)+","+mysql.escape(book_name)+","+mysql.escape(book_author)+")", function(err, result,fields) {
				var barray = [];
				if(err)
					throw err;
				for(var i=0;i<book_q;i++) {
					con.query("INSERT INTO library_books (isbn) values ("+mysql.escape(book_isbn)+"); SELECT LAST_INSERT_ID() as id;", function(err, result, fields) {
						if(err)
							throw err;
						barray[items]=result[1][0].id;
						items++;
						if(items==book_q) {
							res.json(barray);
						}
					})
				}
			});
		}
		else {
			res.status(500).send('Entered book already exists (Use update to update quantity)')
		}
	});
});


app.post('/add_user', (req, res)=>{
	var id = req.body.user_id, name = req.body.user_name, roll = parseInt(req.body.user_roll), dept = req.body.user_dept, pass = req.body.user_pass;
	console.log(id, name, roll, dept, pass);
	con.query("SELECT * from users WHERE user_id="+mysql.escape(id), function(err, result, fields){
		if(err)
			throw err;
		if(typeof result == 'undefined' || result.length == 0){
			con.query("INSERT INTO users values ("+mysql.escape(id)+","+mysql.escape(pass)+","+mysql.escape(name)+","+mysql.escape(dept)+","+mysql.escape(roll)+", 2);", function(err, result, fields){
				if(err)
					throw err;
				res.send('inserted');
			});
		} else{
			res.status(500).send('Entered user already exists');
		}

	})
});

app.get('/book/:id', (req, res)=>{
	var isbn = req.params.id;

	con.query("SELECT * FROM books WHERE isbn="+mysql.escape(isbn), function(err, result1, fields){
		if(err)
			throw err;
		console.log(result1[0], result1.length);
		if(result1.length==0){
			res.send("404");
		} else{
			con.query("SELECT * FROM library_books WHERE isbn="+mysql.escape(isbn), function(err, result2, fields){
				var items = 0, issued_book = [];
				for(var i=0; i<result2.length; i++){
					console.log(result2[i]);
					con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(result2[i].book_id), function(err, result3, fields){
						if(result3.length == 0){
							issued_book.push({book_id : result2[items].book_id, user_id: null, due_date: null});
						} else {
							issued_book.push({book_id : result2[items].book_id, user_id: result3[0].user_id, due_date: result3[0].due_date});
						}
						items++;
						if(items == result2.length){
							console.log(issued_book);
							res.render("book.ejs", {title:"book", result1, issued_book});
						}
					});

				}
			});
		}
	})
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
  database: "library",
  multipleStatements: true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});