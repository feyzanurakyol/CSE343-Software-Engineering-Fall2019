var express = require('express');
var socket = require('socket.io');
var request = require('request');
var bodyParser = require('body-parser')



//*************************//
//Ports and their listeners//
//*************************//
var front = express();
var frontListener = front.listen(4001, function(){
	console.log("localhost:4001 to access the front end")
});
front.use(express.static('front'));

var back = express();
var backListener = back.listen(4000, function(){
	console.log("other groups send to localhost:4000")
});
back.use(express.json());


//*****************//
//Frontend's socket//
//*****************//
var io = socket(frontListener);


io.on('connection', function(socket){
	socket.on('post', function(data){
		post(data)
	});	
});

back.post('/', function(req, res){
	io.emit('postIncoming', req.body);
	if(req.body.ProjectName == "deneme"){
		res.send(req.body);
	}
	
});	



//****************//
//Helper Functions//
//****************//
function post(jsonData){
	request.post(
		'http://localhost:8081',
		{
			json: jsonData
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// no problems
			} else {
				console.log("Error!!!!");
			}
		}
	);
}