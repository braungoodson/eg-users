var express = require('express'),
  bodyParser = require('body-parser'),
  server = express(),
  port = process.env.PORT || 30000,
  staticRoot = __dirname,
  crypto = require('crypto'),
  users = [];

users.find = find;
users.push({name:'admin@egusers.com',password:'admin',token:null});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(logger);
server.use('/', express.static(staticRoot));

server.post('/profile',authenticate,function(q,r){
	r.send({error:false,message:"Authorized."});
});

server.post('/login',function(q,r){
	var user = q.body.user;
	var u = null;
	if (u = users.find(user)) {
		if (u.password == user.password) {
			u.token = Token();
			r.send({user:u,error:false});
		} else {
			r.send({error:true,message:"Incorrect password"});
		}
	} else {
		r.send({error:true,message:"User does not exist."})
	}
});

server.post('/logout',authenticate,function(q,r){
	var user = q.body.user;
	var u = users.find(user);
	u.token = Token();
	r.send({error:false,message:"Logout successful."});
});

server.post('/signup',function(q,r){
	var user = q.body.user;
	var u = null;
	if (u = users.find(user)) {
		r.send({error:true,message:"User already exists."});
	} else {
		users.push(user);
		r.send({error:false,user:user});
	}
});

server.listen(port);
console.log('http://localhost:'+port);

function authenticate (q,r,n) {
	var user = q.body.user;
	var u = null;
	if (u = users.find(user)) {
		if (u.token == user.token) {
			n();
		} else {
			r.send({error:true,message:"Invalid token."});
		}
	} else {
		r.send({error:true,message:"User does not exist."})
	}
}

function logger (q,r,n) {
	console.log('\033[32m >>>\033[0m ' + JSON.stringify({
		url: q.originalUrl,
		params: q.params,
		body: q.body,
		query: q.query
	}));
	n();
}

function find (user) {
	for (var u in users) {
		if (users[u].name == user.name) {
			return users[u];
		}
	}
	return false;
}

function Token () {
	var variance = new Date().getTime().toString();
	var token = crypto
		.createHash('sha1')
		.update(variance)
		.digest('hex')
	;
	return token;
}