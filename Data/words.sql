create table words (
    id serial primary key,
    number int,
    date date,
    title varchar(30),
    content text not null,
    item_id int
);