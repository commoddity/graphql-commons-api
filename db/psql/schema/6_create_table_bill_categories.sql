DROP TABLE IF EXISTS bill_categories CASCADE;

CREATE TABLE bill_categories (
  id SERIAL PRIMARY KEY,
  bill_id INT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories (id) ON DELETE CASCADE
);

GRANT ALL PRIVILEGES ON TABLE bill_categories TO commoddity;
