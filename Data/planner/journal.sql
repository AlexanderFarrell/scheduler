create table journal (
    id serial primary key,
    date date not null default now(),
    wiki_id int not null references wiki(id)
);

create view journal_entry as
select j.id as journal_id,
       w.id as wiki_id,
       j.date,
       w.title as wiki_title,
       content,
       account_id
from journal j
inner join public.wiki w on w.id = j.wiki_id;

create or replace procedure add_journal_entry(
    date_in date,
    username_in varchar(100)
)
language plpgsql
as $$
declare
    wiki_id_in int;
begin
    insert into wiki (title, account_id, content)
    values (concat('Journal - ', to_char(date_in, 'Day, Month DD, YYYY')),
        (select id from account where username=username_in),
            (concat('<a href="/planner/y/',
                    to_char(date_in, 'YYYY'),
                    '/m/',
                    to_char(date_in, 'MM'),
                    '/d/',
                    to_char(date_in, 'DD'),
                    '">Daily Plan</a>')))
    returning id into wiki_id_in;

    insert into journal (date, wiki_id)
    values (date_in, wiki_id_in);
end;$$;
