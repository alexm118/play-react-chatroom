# --- !Ups

CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

CREATE TABLE "room" (
  room_id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TABLE "room_user" (
  room_id INT REFERENCES "room" (room_id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT REFERENCES "user" (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT room_user_pkey PRIMARY KEY (room_id, user_id)
);

# --- !Downs

DROP TABLE "user" ON DELETE CASCADE;
DROP TABLE "room" ON DELETE CASCADE;
DROP TABLE "room_user" ON DELETE CASCADE;