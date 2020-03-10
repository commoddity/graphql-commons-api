DROP TABLE IF EXISTS user_bills CASCADE;

CREATE TABLE user_bills (
  user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bill_id INT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  UNIQUE (user_id, bill_id)
);



GRANT ALL PRIVILEGES ON TABLE user_bills TO commoddity;
