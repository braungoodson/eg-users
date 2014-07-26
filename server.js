var express = require('express'),
  bodyParser = require('body-parser'),
  server = express(),
  port = process.env.PORT || 30000,
  staticRoot = __dirname;

server.use(bodyParser.urlencoded({extended:true}));
server.use('/', express.static(staticRoot));

server.post('/private',authenticate,function(q,r){
	r.send({message:"Authorized."});
});

server.post('/login',function(q,r){
	if (q.body.username == "user" && q.body.password == "user") {
		token = Math.random() + "";
		r.send({token:token});
	} else {
		r.send({error:"Not authorized."});
	}
});

server.post('/logout',function(q,r){
	q.session.authenticated = false;
	r.redirect('/login');
});

server.listen(port);
console.log('http://localhost:'+port);

function authenticate (q,r,n) {
	if (q.body.token == token) {
		n();
	} else {
		r.send({error:"Not authorized."});
	}
}