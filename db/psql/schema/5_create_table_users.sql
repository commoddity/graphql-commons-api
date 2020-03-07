DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (255) NOT NULL,
  last_name VARCHAR (255) NOT NULL,
  password VARCHAR (255) NOT NULL,
  email VARCHAR (255) NOT NULL,
  phone_number BIGINT,
  postal_code VARCHAR (255),
  email_notification VARCHAR (25),
  sms_notification VARCHAR (25),
  active BOOLEAN,
  created_at TIMESTAMP default current_timestamp
);

GRANT ALL PRIVILEGES ON TABLE users TO commoddity;

GRANT ALL ON SEQUENCE users_id_seq TO commoddity;
