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
    add column account_id int not null references account(id);

alter table words
drop column added_on;

select count(*)
from words;


select extract('year' from date)
from words
group by extract('year' from date)
order by extract('year' from date);

select *
from words
where extract('year' from date) = 21;