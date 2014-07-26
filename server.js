var express = require('express'),
  bodyParser = require('body-parser'),
  server = express(),
  port = process.env.PORT || 30000,
  staticRoot = __dirname;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use('/', express.static(staticRoot));

server.post('/private',authenticate,function(q,r){
	r.send({error:false,message:"Authorized."});
});

server.post('/login',function(q,r){
	console.log(q.body);
	if (q.body.user.name == "guest@egusers.com" && q.body.user.password == "guest") {
		token = Math.random() + "";
		r.send({user:{name:'guest@egusers.com',password:'guest',token:token},error:false});
	} else {
		r.send({error:true,message:"Not authorized."});
	}
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