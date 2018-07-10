# --- !Ups

INSERT INTO room VALUES (1, 'general'),(2, 'random');

# --- !Downs
DELETE FROM room
WHERE name = 'general'
OR name = 'random';