-- Your SQL goes here
CREATE TABLE guestbooks (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id)
);