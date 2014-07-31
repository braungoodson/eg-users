create database if not exists eg_users;

connect eg_users;

create table if not exists users (
	uid int not null primary key auto_increment,
	uname varchar(64) not null,
	upassword varchar(64) not null
);

create user 'egusersdbuser'@'localhost' identified by 'egusersdbuser';

grant all privileges on eg_users.* to 'egusersdbuser'@'localhost';

insert into users (uname,upassword) values ('administrator','administrator');