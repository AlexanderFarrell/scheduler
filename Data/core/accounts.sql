create table if not exists account (
    id serial primary key,
    first_name varchar(50),
    last_name varchar(50),
    username varchar(30) not null unique,
    password varchar(128) not null
);

-- truncate account cascade ;