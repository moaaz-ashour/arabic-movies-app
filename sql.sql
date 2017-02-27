DROP TABLE IF EXISTS users;

CREATE TABLE users (
   id SERIAL primary key,
   username VARCHAR(255) not null,
   email VARCHAR(255) not null unique,
   password VARCHAR(255) not null,
   timestamp TIMESTAMP default current_timestamp
);
