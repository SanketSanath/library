const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const upload = require('express-fileupload');

var sess = {
  secret: 'library secret. cant guess',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
};



const app = express();

app.use(upload());
app.use(express.static(__dirname+'/../public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sess))
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.set('view engine', 'ejs');
app.set('trust proxy', 1)



//ho-me route
app.get('/', (req, res)=>{
	res.render('login.ejs', {title: "Login"});
});

function isAdmin(req, res, next) {
	console.log(req.session);
	if(!req.session.user_id||!req.session.admin) {
		req.session.destroy();
		res.redirect("/")
	} else {
		next();
	}
}
function isUser(req, res, next) {
	console.log(req.session);
	if(!req.session.user_id||req.session.admin) {
		req.session.destroy();
		res.redirect("/")
	} else {
		next();
	}
}
app.post('/admin/login', (req, res)=>{
	var user_id = req.body.admin_id;
	var password = req.body.password;
	console.log(user_id, password);
	con.query("SELECT * FROM users WHERE user_id="+mysql.escape(user_id), function (err, result, fields) {
		if(err)
			throw err;
		console.log(result);
		if(typeof result=='undefined'|| result.length==0) {
			console.log('error');
			res.status(500).send('Invalid credentials')
		}
		else {
			console.log(result[0].type);
			if(result[0].type==1 && bcrypt.compareSync(password, result[0].password)) {
				req.session.user_id=user_id;
				req.session.admin=1;
				res.redirect("/admin/dashboard")
			}
			else
				res.status(500).send('Given credentials are not of admin')

		}
	});
});

app.post('/user/login', (req, res)=>{
	var user_id = req.body.user_id;
	var password = req.body.password;
	console.log(user_id, password);
	con.query("SELECT * FROM users WHERE user_id="+mysql.escape(user_id), function (err, result, fields) {
		if(err)
			throw err;
		console.log(result);
		if(typeof result=='undefined'|| result.length==0) {
			console.log('error');
			res.status(500).send('Invalid credentials')
		}
		else {
			console.log(result[0].type);
			if(result[0].type==2 && bcrypt.compareSync(password, result[0].password)) {
				req.session.user_id=user_id;
				res.redirect("/user/dashboard")
			}
			else
				res.status(500).send('Given credentials are not of user')

		}
	});
});

app.post('/add_book',isAdmin, (req,res)=> {
	console.log("Entered add book");
	var book_isbn = req.body.book_isbn;
	var book_name = req.body.book_name;
	var book_author = req.body.book_author;
	var book_q = req.body.book_q;
	var section = req.body.section;
	var sub_section = req.body.sub_section;
	var file_url = "NULL";


	con.query("SELECT * FROM books WHERE isbn="+mysql.escape(book_isbn), function (err, result, fields) {
		if(err)
			throw err;
		if(typeof result == 'undefined' || result.length==0) {
			var items=0;
			//upload e-book
			if (Object.keys(req.files).length != 0) {
				var salt = bcrypt.genSaltSync(10);
				var sampleFile = req.files.pdf_file;
				var file_url = (+new Date())+sampleFile.name.replace(/\s/g, '');
				console.log(file_url);
		    	sampleFile.mv(__dirname+'/../ebooks/'+file_url, function(err) {
			    if (err)
			      return res.status(500).send(err);

			    //res.send('File uploaded!');
			  });
		  	}
			con.query("INSERT INTO books values ("+mysql.escape(book_isbn)+","+mysql.escape(book_name)+","+mysql.escape(book_author)+","+mysql.escape(section)+","+mysql.escape(sub_section)+","+mysql.escape(file_url)+")", function(err, result,fields) {
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
							// res.json(barray);
							res.redirect('/barcodes/'+barray);
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


app.post('/add_user',isAdmin, (req, res)=>{
	var id = req.body.user_id, name = req.body.user_name, roll = parseInt(req.body.user_roll), dept = req.body.user_dept, pass = req.body.user_pass;
	console.log(id, name, roll, dept, pass);
	con.query("SELECT * from users WHERE user_id="+mysql.escape(id), function(err, result, fields){
		if(err)
			throw err;
		if(typeof result == 'undefined' || result.length == 0){
			var salt = bcrypt.genSaltSync(10);
			con.query("INSERT INTO users values ("+mysql.escape(id)+","+mysql.escape(bcrypt.hashSync(pass, salt))+","+mysql.escape(name)+","+mysql.escape(dept)+","+mysql.escape(roll)+", 2, 0);", function(err, result, fields){
				if(err)
					throw err;
				res.send('inserted');
			});
		} else{
			res.status(500).send('Entered user already exists');
		}

	})
});


//search book
app.get('/admin/book/:id',isAdmin, (req, res)=>{
	var isbn = req.params.id;

	con.query("SELECT * FROM books WHERE isbn="+mysql.escape(isbn), function(err, result1, fields){
		if(err)
			throw err;

		if(result1.length==0){
			res.send("404");
		} else{
			con.query("SELECT * FROM library_books WHERE isbn="+mysql.escape(isbn), function(err, result2, fields){
				var items = 0, issued_book = [];
				result1[0].total_book = result2.length; //total library books
				result1[0].available_book = 0;
				for(var i=0; i<result2.length; i++){
					con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(result2[i].book_id), function(err, result3, fields){
						if(result3.length == 0){
							issued_book.push({book_id : result2[items].book_id, user_id: null, due_date: null});
							result1[0].available_book++; //if book is not borrowed then its available
						} else {
							issued_book.push({book_id : result2[items].book_id, user_id: result3[0].user_id, due_date: result3[0].due_date});
						}
						items++;
						if(items == result2.length){
							res.render("book.ejs", {title:"book", result1, issued_book});
						}
					});

				}
			});
		}
	})
});

app.get('/admin/book_name/:name',isAdmin, (req, res)=>{
	var namePattern = req.params.name;

	con.query("SELECT * FROM books WHERE name like "+mysql.escape('%'+namePattern+'%'), function(err, result1, fields){
		if(err)
			throw err;

		if(result1.length==0){
			res.send("404");
		} else{
			var i1=0;
			for(var i=0;i<result1.length;i++) {
				var name = result1[i].name;
				var author = result1[i].author;
				var isbn = result1[i].isbn;
				con.query("SELECT * FROM library_books WHERE isbn="+mysql.escape(isbn), function(err, result2, fields){
					var items = 0, issued_book = [];
					i1++;
					result1[0].total_book = result2.length; //total library books
					result1[0].available_book = 0;
					for(var i=0; i<result2.length; i++){
						con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(result2[i].book_id), function(err, result3, fields){
							if(result3.length == 0){
								issued_book.push({book_id : result2[items].book_id, user_id: null, due_date: null, name: name, author: author});
								result1[0].available_book++; //if book is not borrowed then its available
							} else {
								issued_book.push({book_id : result2[items].book_id, user_id: result3[0].user_id, due_date: result3[0].due_date, name: name, author: author});
							}
							items++;
							if(items == result2.length && i1 == result1.length){
								res.render("books.ejs", {title:"Books", result1, issued_book});
							}
						});

					}
				});
			}
		}
	})
});

app.get('/admin/book_author/:author', isAdmin, (req, res)=>{
	var authorPattern = req.params.author;

	con.query("SELECT * FROM books WHERE author like "+mysql.escape('%'+authorPattern+'%'), function(err, result1, fields){
		if(err)
			throw err;

		if(result1.length==0){
			res.send("404");
		} else{
			var i1=0;
			for(var i=0;i<result1.length;i++) {
				var name = result1[i].name;
				var author = result1[i].author;
				var isbn = result1[i].isbn;
				con.query("SELECT * FROM library_books WHERE isbn="+mysql.escape(isbn), function(err, result2, fields){
					var items = 0, issued_book = [];
					i1++;
					result1[0].total_book = result2.length; //total library books
					result1[0].available_book = 0;
					for(var i=0; i<result2.length; i++){
						con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(result2[i].book_id), function(err, result3, fields){
							if(result3.length == 0){
								issued_book.push({book_id : result2[items].book_id, user_id: null, due_date: null, name: name, author: author});
								result1[0].available_book++; //if book is not borrowed then its available
							} else {
								issued_book.push({book_id : result2[items].book_id, user_id: result3[0].user_id, due_date: result3[0].due_date, name: name, author:  author});
							}
							items++;
							if(items == result2.length && i1 == result1.length){
								res.render("books.ejs", {title:"Books", result1, issued_book});
							}
						});

					}
				});
			}
		}
	})
});

app.get('/user/book/:id', isUser, (req, res)=>{
	var isbn = req.params.id;

	con.query("SELECT * FROM books WHERE isbn="+mysql.escape(isbn), function(err, result1, fields){
		if(err)
			throw err;

		if(result1.length==0){
			res.send("404");
		} else{
			con.query("SELECT * FROM library_books WHERE isbn="+mysql.escape(isbn), function(err, result2, fields){
				var items = 0, issued_book = [];
				result1[0].total_book = result2.length; //total library books
				result1[0].available_book = 0;
				for(var i=0; i<result2.length; i++){
					con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(result2[i].book_id), function(err, result3, fields){
						if(result3.length == 0){
							issued_book.push({book_id : result2[items].book_id, user_id: null, due_date: null});
							result1[0].available_book++; //if book is not borrowed then its available
						} else {
							issued_book.push({book_id : result2[items].book_id, user_id: result3[0].user_id, due_date: result3[0].due_date});
						}
						items++;
						if(items == result2.length){
							res.render("book_user.ejs", {title:"book", result1, issued_book});
						}
					});

				}
			});
		}
	})
});

app.get('/user/book_name/:name',isUser, (req, res)=>{
	var namePattern = req.params.name;

	con.query("SELECT * FROM books WHERE name like "+mysql.escape('%'+namePattern+'%'), function(err, result1, fields){
		if(err)
			throw err;

		if(result1.length==0){
			res.send("404");
		} else{
			var i1=0;
			for(var i=0;i<result1.length;i++) {
				var name = result1[i].name;
				var author = result1[i].author;
				var isbn = result1[i].isbn;
				con.query("SELECT * FROM library_books WHERE isbn="+mysql.escape(isbn), function(err, result2, fields){
					var items = 0, issued_book = [];
					i1++;
					result1[0].total_book = result2.length; //total library books
					result1[0].available_book = 0;
					for(var i=0; i<result2.length; i++){
						con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(result2[i].book_id), function(err, result3, fields){
							if(result3.length == 0){
								issued_book.push({book_id : result2[items].book_id, user_id: null, due_date: null, name: name, author: author});
								result1[0].available_book++; //if book is not borrowed then its available
							} else {
								issued_book.push({book_id : result2[items].book_id, user_id: result3[0].user_id, due_date: result3[0].due_date, name: name, author: author});
							}
							items++;
							if(items == result2.length && i1 == result1.length){
								res.render("books_user.ejs", {title:"Books", result1, issued_book});
							}
						});

					}
				});
			}
		}
	})
});

app.get('/user/book_tag/:tags', (req,res)=> {
	a
});

app.get('/user/book_author/:author', isUser, (req, res)=>{
	var authorPattern = req.params.author;

	con.query("SELECT * FROM books WHERE author like "+mysql.escape('%'+authorPattern+'%'), function(err, result1, fields){
		if(err)
			throw err;

		if(result1.length==0){
			res.send("404");
		} else{
			var i1=0;
			for(var i=0;i<result1.length;i++) {
				var name = result1[i].name;
				var author = result1[i].author;
				var isbn = result1[i].isbn;
				con.query("SELECT * FROM library_books WHERE isbn="+mysql.escape(isbn), function(err, result2, fields){
					var items = 0, issued_book = [];
					i1++;
					result1[0].total_book = result2.length; //total library books
					result1[0].available_book = 0;
					for(var i=0; i<result2.length; i++){
						con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(result2[i].book_id), function(err, result3, fields){
							if(result3.length == 0){
								issued_book.push({book_id : result2[items].book_id, user_id: null, due_date: null, name: name, author: author});
								result1[0].available_book++; //if book is not borrowed then its available
							} else {
								issued_book.push({book_id : result2[items].book_id, user_id: result3[0].user_id, due_date: result3[0].due_date, name: name, author:  author});
							}
							items++;
							if(items == result2.length && i1 == result1.length){
								res.render("books_user.ejs", {title:"Books", result1, issued_book});
							}
						});

					}
				});
			}
		}
	})
});

app.get('/barcodes/:id',isAdmin, (req, res)=>{
	console.log(req.params.id)
	var array=req.params.id.split(',');
	res.render("barcodes.ejs",{results: array});
});

app.post('/submit_fine',isAdmin, (req, res)=>{
	var user_id=req.body.user_id;
	var submitted = req.body.submitted;
	con.query("update users set due_fines=due_fines-"+mysql.escape(submitted)+" where user_id="+mysql.escape(user_id), function(err,result,fields) {
		if(err) throw err;
		res.send("Done");
	})
});
app.post('/get_fine',isAdmin, (req, res)=>{
	var user_id=req.body.user_id;
	con.query("SELECT * FROM users where user_id="+mysql.escape(user_id), function(err,result,fields) {
		if(err) throw err;
		console.log(result[0]);
		res.json({fine: result[0].due_fines})
	})
});

app.get('/book_list', (req, res)=>{
	con.query("SELECT * FROM books;", function(err, result, fields){
		if(err) throw err;
		// res.json({fine : result[0].due_fines});
		res.render('book_list.ejs', {books : result});
	});
});

app.get('/user_list',isAdmin, (req, res)=>{
	con.query("SELECT * FROM users WHERE type != '1';", function(err, result, fields){
		if(err) throw err;
		res.render("user_list.ejs", {users : result});
	});
});

//issue book
app.post('/issue_book',isAdmin, (req, res)=>{
	var book_id = req.body.book_id;
	var issue_to = req.body.issue_to;
	console.log(book_id, issue_to);

	con.query("SELECT * FROM users WHERE user_id ="+mysql.escape(issue_to)+";", function(err, result, fields){
		if(err) throw err;

		//check if user exists
		if(result.length == 0){
			res.status(400).send('User doesnot exists');
		} else{
			con.query("SELECT * FROM library_books WHERE book_id ="+book_id, function(err, result, fields){
				if (err) throw err;
				//check if book exist or not
				if(result.length == 0){
					//book doesn't exist
					res.status(400).send('Book doesnot exist');
				} else {
					//book exist
					//check if book is already issued or not
					con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(book_id)+";", function(err, result, fields){
						if(result.length==0){
							con.query("INSERT INTO borrowed VALUES ("+mysql.escape(issue_to)+","+mysql.escape(book_id)+",DATE_ADD(CURDATE(), INTERVAL 7 DAY))", function(err, result, fields){
								if(err) throw err;
								res.send("success");
							});
						} else{
							res.status(409).send('Book already issued');
						}
					})
				}
			})
			
		}
	});
});


//return book to library
app.delete('/return_book',isAdmin, (req, res)=>{
	var book_id = req.body.book_id;
	con.query("SELECT * FROM borrowed WHERE book_id="+mysql.escape(book_id)+";", function(err, result, fields){
		//check if book is issued to anyone or not
		if(result.length == 0){
			res.status(404).send('Book is not issued to anyone');
		} else{
			console.log(result[0])
			console.log(new Date())
			var diff = ( new Date() - result[0].due_date )/86400000;
			var fineadd = 0;
			if(diff>0) {
				fineadd += diff*5;
			}
			var result2=[];
			con.query("DELETE FROM borrowed WHERE book_id="+mysql.escape(book_id)+";", function(err, result2, fields){
				if(err) throw err;
				if(fineadd!=0) {
					con.query("update users set due_fines=due_fines+"+mysql.escape(fineadd)+" where user_id="+mysql.escape(result[0].user_id), function(err,result2,fields) {
						if(err) throw err;
						res.send("success");
					})
				}
				else {
					res.send("success");
				}
			});
		}
	});
});

app.get('/logout',(req,res)=> {
	req.session.destroy();
	res.redirect('/');
})

app.get('/search_books',(req,res)=> {
	res.render('search_books.ejs');
})

app.get('/search_tags',(req,res)=> {
	console.log("Getting tag");
	con.query("SELECT * FROM tag_names", function(err,result1,fields) {
		var tags = [];
		if(err)
			throw err;
		for(var i = 0; i < result1.length; i ++) {
			tags[i]=result1[i].name;
		}
		res.render('search_tags.ejs', {tags:tags});
	})
})

app.post('/search_tags',(req,res)=> {
	console.log(req.body);
	console.log("SELECT * FROM book_tags where tag in ("+req.body.str+")");
	con.query("SELECT * FROM book_tags where tag in ("+mysql.escape(req.body.str)+")", function(err,result1,fields) {
		var tags = [];
		if(result1.length>0) {
			var str="";
			for(var i = 0;i<result1.length-1;i++) {
				str+=result1[i].isbn+","
			}
			str+=result1[result1.length-1].isbn;
			//render these books
			console.log(str);
		}
		else {
			res.status(404).json({empty: true});
		}
	})
})


app.get('/view_user/:id',isAdmin, (req, res)=>{
	var id = req.params.id;

	con.query("SELECT * FROM users WHERE user_id="+mysql.escape(id), function(err, result1, fields){
		if(err)
			throw err;
		console.log(result1[0], result1.length);
		if(result1.length==0){
			res.send("404");
		}
		else{
			result1[0].password = "null";
			con.query("SELECT * FROM borrowed WHERE user_id="+mysql.escape(id), function(err, result2, fields){
				var items = 0, issued_book = [];
				console.log(result2);
				while(items<result2.length) {
					issued_book.push({book_id : result2[items].book_id,due_date: result2[items].due_date});
					items++;
				}
				console.log(issued_book);
				res.render("user.ejs", {title:"Users", result1, issued_book});
			});
		}
	})
});

app.get('/admin/dashboard',isAdmin, (req, res)=>{
	res.render('admin_dashboard.ejs', {title: "Admin"});
});

app.get('/user/dashboard',isUser, (req, res)=>{
	var user_id = req.session.user_id;
	con.query("SELECT * FROM users WHERE user_id="+mysql.escape(user_id), function (err, result, fields) {
		if(err)
			throw err;
		if(typeof result=='undefined'|| result.length==0) {
			console.log('error');
			res.status(500).send('Invalid details')
		}
		else {
			var result2=[],result3=[],result4 = [];
			con.query("SELECT * FROM borrowed WHERE user_id="+mysql.escape(user_id), function(err, result2, fields){
				var items = 0, issued_book = [];
				console.log("Go!")
				console.log(result2);
				if(result2.length==0) {
					res.render('user_dashboard.ejs',{title:"User",user_id,result,issued_book})
				}
				for(var i=0;i<result2.length;i++) {
					con.query("SELECT * FROM library_books WHERE book_id="+mysql.escape(result2[items].book_id),function(err,result3,fields) {
						if(err)
							throw err;
						console.log(result3[0])
						con.query("SELECT * FROM books WHERE isbn="+mysql.escape(result3[0].isbn), function(err, result4, fields) {
							issued_book.push({book_id : result2[items].book_id, due_date: result2[items].due_date, isbn:result3[0].isbn, name: result4[0].name, author: result4[0].author})
							items++;
							if(items==result2.length) {
								res.render('user_dashboard.ejs', {title: "User",user_id,result,issued_book});
							}
						})
					})
				}
			});
		}
	});
});


//elib dashboard
app.get('/elib', isUser, (req, res)=>{
	var user = req.session.user_id;
	con.query("SELECT isbn, name, author, url from books where url IS NOT NULL", function(err, result, fields){
		res.render('elib.ejs', {result, user});
	})
})

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