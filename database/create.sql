create database if not exists eg_users;

connect eg_users;

create table if not exists users (
	uid int not null primary key auto_increment,
	uname varchar(64) not null,
	upassword varchar(64) not null
);

create user 'eg-users-db-user'@'localhost' identified by 'eg-users-db-user';

grant all privileges on eg_users.* to 'eg-users-db-user'@'localhost';

insert into eg_users (uname,upassword) values ('administrator','administrator');