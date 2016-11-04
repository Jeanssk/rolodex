console.log("Rolodex database")

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://jeanssk:sk@ds049548.mlab.com:49548/rolodex', (err,database) => {
	if (err) return console.log(err)

		db =database

	app.listen(2000, function () {
		console.log('listening on 2000')
	})
})

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine','ejs')

//I don't really get what this piece of code does...
app.get('/', (req,res) =>  {
	db.collection('infocards').find().toArray(function(err, results) {
		if (err) return console.log(err)

			res.render('index.ejs', {infocards: results})	
	})
	//res.sendFile(__dirname + '/index.html')
})

//save submitted info to the database when submit button is clicked
app.post('/infocards', (req,res) => {
	db.collection('infocards').save(req.body, (err,results) => {
		if (err) return console.log(err)

			console.log('saved to database')
		res.redirect('/')	
	})
})


//////////////////DISPLAY/////////////////////////



//get the info of the student in the database and display it in display.ejs
app.get('/student/:id', (req,res) =>  {

	var id = require('mongodb').ObjectID(req.params.id);

	db.collection('infocards').find({"_id": id }).toArray(function(err, results) {
		if (err) return console.log(err)
			console.log(results[0].name)	
		res.render('display.ejs', {infocards: results})	;
	})
	
})
//


//when update is clicked, thepage update.ejs will be displayed
app.get('/update/:id', (req,res)=> {

	

	res.render('update.ejs', {studentid:req.params.id });

})


////////////////////////UPDATE/////////////////////

//I think something is missing in this piece of code
// app.post('/update/:id', (req,res) => {

// // 	var id = require('mongodb').ObjectID(req.params.id);
// // 	console.log(id)
// // 	db.collection('infocards').findOneAndUpdate({"_id":id}, {}


// // 		$set: {
// // 			name: req.body.name,
// // 			email: req.body.email,
// // 			address: req.body.address
// // 		}
// // 		})

// // 		// (err, results) => {
// // 		// if (err) return console.log(err)

// // 		console.log('saved to database')
// // 		res.render('display.ejs', {infocards:results})	
// // 	})
// // })

app.post('/update/:id', (req, res) => {
	var id = require('mongodb').ObjectID(req.params.id);

	db.collection('infocards')
	.findOneAndUpdate({"_id": id}, {
		$set: {
			name: req.body.name,
			adress: req.body.address,
			email: req.body.email
		}
	}, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/student/'+id)	
  })
})






// 	}, (req,res) => {

// 		console.log('saved to database')
// 		res.render('display.ejs',{infocards: results})
// 	})
// })




