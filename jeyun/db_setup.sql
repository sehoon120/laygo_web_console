DROP DATABASE IF EXISTS laygo;
CREATE DATABASE laygo;

use laygo;

CREATE TABLE User(
    username varchar(32),
    pw varchar(32),
    deposit INT,
    primary key (username)
);
