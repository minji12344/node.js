create database webdb;
create user web identified by 'pass';
grant all privileges on webdb.* to web@'%';

ALTER USER 'web'@'%'
IDENTIFIED WITH mysql_native_password
BY 'pass';