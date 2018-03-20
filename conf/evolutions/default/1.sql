# --- !Ups

CREATE TABLE "USERS" (
    username VARCHAR NOT NULL PRIMARY KEY,
    password VARCHAR NOT NULL,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

# --- !Downs

DROP TABLE "USERS";