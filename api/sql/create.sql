DROP TABLE "useraccount";

CREATE TABLE "useraccount" (
  "id"                serial primary key not null,
  "username"          text not null unique,
  "hashed_password"   text not null,
  "salt"              text not null,
  "meta"              json
);
