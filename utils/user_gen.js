const mysql = require('mysql');
const bcrypt = require('bcryptjs');



function insert_user(){
	var salt = bcrypt.genSaltSync(10);
	con.query('insert into users values ("admin","'+bcrypt.hashSync("admin", salt)+'" , "Administrator", NULL, NULL, 1);', function(err, result, fields){
		if(err)
			throw err;
		else
			console.log("admin added");
	});
	con.query('insert into users values ("rituraj","'+bcrypt.hashSync("rituraj", salt)+'" , "Ritu Raj", "IT", 1607005, 2);', function(err, result, fields){
		if(err)
			throw err;
		else
			console.log("Ritu Raj added");
	});
	con.query('insert into users values ("sanket","'+bcrypt.hashSync("sanket", salt)+'" , "SAnket SAnath", "IT", 1607008, 2);', function(err, result, fields){
		if(err)
			throw err;
		else
			console.log("SAnket SAnath added");
	});
}

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
  insert_user();
});