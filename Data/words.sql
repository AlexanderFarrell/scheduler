create table words (
    id serial primary key,
    number int,
    date date,
    title varchar(30),
    content text not null,
    item_id int
);

alter table words
add column added_on timestamptz not null default now();

alter table words
drop column added_on;

select count(*)
from words;