var express = require('express'),
  bodyParser = require('body-parser'),
  crypto = require('crypto'),
  mariasql = require('mariasql'),
  server = express(),
  maria = new mariasql(),
  port = process.env.PORT || 30000,
  staticRoot = __dirname,
  users = [];

// -- legacy
users.find = find;
users.push({name:'admin@egusers.com',password:'admin',token:null});
// -- 

maria.connect({
    host: 'localhost',
    user: 'eg-users-db-user',
    password: 'eg-users-db-user',
    db: 'eg_users'
});

maria.on('connect', function() {
    logger1(false,'connected to maria');
}).on('error', function(e) {
    logger1(true,'error: maria: ' + e);
}).on('close', function(c) {
    logger1(true,'warning: maria: closed: ' + c);
});

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
	user.existed = false;
	user.query = {};
	user.query.error = false;
	user.query.ended = false;
	maria
		.query('select uname, upassword from users;')
		.on('result',function(result){
			result
				.on('row',function(row){
					user.existed = true;
					user.query.error = true;
				})
				.on('error',function(error){
					logger1(true,'error: '+error);
					user.query.error = error;
				})
				.on('end',function(){
					logger1(false,'end: result: select uname, upassword from users;')
					user.query.ended = true;
				})
			;
		})
		.on('end',function(){
			if (user.query.error) {
				if (user.existed) {
					r.send({error:true,message:'User already exists.'})
				}
				if (user.query.error) {
					r.send({error:true,message:user.query.error})
				}
			}
			if (!user.query.error) {
				if (!user.existed) {
					maria
						.query('insert into users (uname,upassword) values ('+user.name+','+user.password+');')
						.on('result',function(result){
							result
								.on('row',function(row){
									user.name = row.uname;
									user.password = row.upassword;
									user.existed = false;
									user.query.error = false;
								})
								.on('error',function(error){
									logger1(true,'error: '+error);
									user.query.error = error;
								})
								.on('end',function(){
									logger1(false,'end: result: select uname, upassword from users;')
									user.query.ended = true;
								})
							;
						})
						.on('end',function(){
							if (user.query.error) {
								if (user.existed) {
									r.send({error:true,message:'User already exists.'})
								}
								if (user.query.error) {
									r.send({error:true,message:user.query.error})
								}
							}
							if (!user.query.error) {
								if (!user.existed) {
									r.send({error:false,user:user});
								}
							}
						})
					;
				}
			}
			logger1(false,'end: select uname, upassword from users;');
		})
	;
});

server.listen(port);
logger1(false,'http://localhost:'+port);



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

function logger1 (e,l) {
	if (e) {
		console.log('\033[31m >>>\033[0m ' + l);
	} else {
	console.log('\033[32m >>>\033[0m ' + l);
	}
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