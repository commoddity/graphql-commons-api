DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (255) NOT NULL,
  last_name VARCHAR (255) NOT NULL,
  username VARCHAR (255) NOT NULL UNIQUE,
  password VARCHAR (255) NOT NULL,
  email VARCHAR (255) NOT NULL UNIQUE,
  phone_number BIGINT,
  postal_code VARCHAR (255),
  email_notification INT,
  sms_notification INT,
  active BOOLEAN,
  created_at TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE users TO commoddity;

GRANT ALL ON SEQUENCE users_id_seq TO commoddity;
