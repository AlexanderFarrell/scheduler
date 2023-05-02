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


create view word_counts as
    select title, count(*) as count
    from words
    group by title
    order by title;

select title, content, date, char_length(content), words.account_id
from words
where words.account_id=11
order by char_length(content) desc ;