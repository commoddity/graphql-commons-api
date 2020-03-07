DROP TABLE IF EXISTS user_categories CASCADE;

CREATE TABLE user_categories (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories (id) ON DELETE CASCADE
);

GRANT ALL PRIVILEGES ON TABLE user_categories TO commoddity;
