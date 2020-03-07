DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  bill_id INT NOT NULL REFERENCES bills (id),
  code VARCHAR (25) NOT NULL,
  title VARCHAR (555) NOT NULL,
  publication_date DATE,
  created_at TIMESTAMP default current_timestamp
);

GRANT ALL PRIVILEGES ON TABLE events TO commoddity;

GRANT ALL ON SEQUENCE events_id_seq TO commoddity;
