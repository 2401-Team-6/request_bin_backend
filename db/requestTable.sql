DROP TABLE requests;
DROP TABLE endpoints;

CREATE TABLE endpoints (
  id serial PRIMARY KEY,
  name char(21) NOT NULL UNIQUE,
  created numeric NOT NULL DEFAULT(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP))
);

CREATE TABLE requests (
  id serial PRIMARY KEY,
  mongo_id char(24) NOT NULL UNIQUE,
  endpoint_id integer REFERENCES endpoints(id) NOT NULL,
  created numeric NOT NULL DEFAULT(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)),
  method varchar(10) NOT NULL,
  path varchar(50) NOT NULL
);