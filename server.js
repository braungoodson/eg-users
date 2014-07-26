var express = require('express'),
  bodyParser = require('body-parser'),
  server = express(),
  port = process.env.PORT || 30000,
  staticRoot = __dirname;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(logger);
server.use('/', express.static(staticRoot));

server.post('/profile',authenticate,function(q,r){
	r.send({error:false,message:"Authorized."});
});

server.post('/login',function(q,r){
	if (q.body.user.name == "admin@egusers.com" && q.body.user.password == "admin") {
		token = Math.random() + "";
		r.send({user:{name:'admin@egusers.com',password:'admin',token:token},error:false});
	} else {
		r.send({error:true,message:"Not authorized."});
	}
});

server.post('/logout',function(q,r){
	token = Math.random();
	r.send({error:false,message:"Logout successful."});
});

server.listen(port);
console.log('http://localhost:'+port);

function authenticate (q,r,n) {
	if (q.body.user.token == token) {
		n();
	} else {
		r.send({error:true,message:"Not authorized."});
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