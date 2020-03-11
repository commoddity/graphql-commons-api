DROP TABLE IF EXISTS bills CASCADE;

CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  parliamentary_session_id INT NOT NULL REFERENCES parliamentary_sessions (id),
  code VARCHAR (7) NOT NULL UNIQUE,
  title VARCHAR (555) NOT NULL,
  description VARCHAR (2555),
  introduced_date DATE,
  summary_url VARCHAR(555),
  page_url VARCHAR(555),
  full_text_url VARCHAR(555),
  passed BOOLEAN,
  created_at TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE bills TO commoddity;

GRANT ALL ON SEQUENCE bills_id_seq TO commoddity;
