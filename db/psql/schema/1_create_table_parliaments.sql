DROP TABLE IF EXISTS parliaments CASCADE;

CREATE TABLE parliaments (
  id SERIAL PRIMARY KEY,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP
);

ALTER SEQUENCE parliaments_id_seq RESTART WITH 43;

GRANT ALL PRIVILEGES ON TABLE parliaments TO commoddity;

GRANT ALL ON SEQUENCE parliaments_id_seq TO commoddity;
