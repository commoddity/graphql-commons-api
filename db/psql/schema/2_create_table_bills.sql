DROP TABLE IF EXISTS bills CASCADE;

CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  parliamentary_session_id INT NOT NULL REFERENCES parliamentary_sessions (id),
  code VARCHAR (25) NOT NULL UNIQUE,
  title VARCHAR (555) NOT NULL,
  description VARCHAR (2555) NOT NULL,
  introduced_date DATE,
  summary_url VARCHAR(555),
  page_url VARCHAR(555),
  full_text_url VARCHAR(555),
  passed BOOLEAN,
  created_at TIMESTAMP default current_timestamp
);

GRANT ALL PRIVILEGES ON TABLE bills TO commoddity;

GRANT ALL ON SEQUENCE bills_id_seq TO commoddity;
