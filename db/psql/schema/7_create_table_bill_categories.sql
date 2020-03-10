DROP TABLE IF EXISTS bill_categories CASCADE;

CREATE TABLE bill_categories (
  bill_id INT NOT NULL REFERENCES bills (id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  UNIQUE (bill_id, category_id)
);

GRANT ALL PRIVILEGES ON TABLE bill_categories TO commoddity;
