DROP TABLE IF EXISTS parliamentary_sessions CASCADE;

CREATE TABLE parliamentary_sessions (
  id SERIAL PRIMARY KEY,
  number BIGINT,
  start_date DATE,
  end_date DATE
);

GRANT ALL PRIVILEGES ON TABLE parliamentary_sessions TO commoddity;

GRANT ALL ON SEQUENCE parliamentary_sessions_id_seq TO commoddity;
