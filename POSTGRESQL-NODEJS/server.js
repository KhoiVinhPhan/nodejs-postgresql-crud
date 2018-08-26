//Config
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);

//Config connected postgresql
const { Pool, Client } = require('pg');
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgresql-nodejs',
	password: '123456',
	port: 5432,
})

//Config body-parser
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Route
app.get("/student/list", function(req, res){
	pool.query("SELECT * FROM sinhvien", (err, result) => {
		if (err) {
		    console.log(err.stack);
		} else {
		    res.render("student_list.ejs", {danhsachsinhvien:result});
		}
	});
});

app.get("/student/create", function(req, res){
	res.render("student_create");
});

app.post("/student/create", urlencodedParser, function(req, res){
	var name = req.body.txtName;
	var email = req.body.txtEmail;
	pool.query("INSERT INTO sinhvien(hoten, email) VALUES('"+name+"', '"+email+"')", (err, result) => {
		if (err) {
		    console.log(err.stack);
		} else {
		    res.redirect("../student/list");
		}
	});
});

app.get("/student/:id/edit", function(req, res){
	var id = req.params.id;
	pool.query("SELECT * FROM sinhvien WHERE id='"+id+"'", (err, result) => {
		if (err) {
		    console.log(err.stack);
		} else {
		    res.render("student_edit.ejs", {sinhvien:result.rows[0]});
		}
	});
});

app.post("/student/update", urlencodedParser, function(req, res){
	var id = req.body.txtId;
	var name = req.body.txtName;
	var email = req.body.txtEmail;
	pool.query("UPDATE sinhvien SET hoten='"+name+"', email='"+email+"' WHERE id='"+id+"' ", (err, result) => {
		if (err) {
		    console.log(err.stack);
		} else {
		    res.redirect("../student/list");
		}
	});
});

app.get("/student/:id/delete", function(req, res){
	var id = req.params.id;
	pool.query("DELETE FROM sinhvien WHERE id='"+id+"'", (err, result) => {
		if (err) {
		    console.log(err.stack);
		} else {
		    res.redirect("../../student/list");
		}
	});
});