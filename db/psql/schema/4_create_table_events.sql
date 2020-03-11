DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  bill_code VARCHAR (7) NOT NULL REFERENCES bills (code),
  title VARCHAR (555) NOT NULL,
  publication_date DATE,
  created_at TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE events TO commoddity;

GRANT ALL ON SEQUENCE events_id_seq TO commoddity;
