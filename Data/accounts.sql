create table account (
    id serial primary key,
        username varchar(20) not null unique,
    hash varchar(128) not null
);

select * from account;




truncate account;