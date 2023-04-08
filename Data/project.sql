create type Status as enum (
    'Not Started',
    'In Development',
    'Completed',
    'On-Going',
    'Retired'
);

create type Size as enum (
    'Small',
    'Medium',
    'Large'
);

create table project (
    id serial primary key,
    title varchar(100) not null unique,
--     description text not null default '',
    status status not null default 'Not Started',
--     benefits text not null default '',
--     risks text not null default '',
    time Size not null default 'Small',
    maintenance Size,
    priority decimal not null default 0,
    account_id int not null references account(id)
--     wiki_page int references wiki(id)
--     notes text not null default ''
);

update project p
set account_id=11
where p.account_id=10;

update project_category c
set account_id=11
where c.account_id=10;

update wiki w
set account_id=11
where w.account_id=10;

update words
    set account_id=11;

select * from words;

alter table words
add column account_id int references account(id);

select * from wiki;

create table deliverable (
    id serial primary key,
    title varchar(150) not null,
    created_on timestamptz not null default now(),
    completed timestamptz,
    project_id int not null references project(id)
);

drop table deliverable;

alter table deliverable
add column created_on timestamptz not null default now();



create table project_category (
    id serial primary key,
    title varchar(150) not null,
    account_id int not null references account(id)
);

create table project_category_link(
    id serial primary key,
    category_id int not null references project_category(id),
    project_id int not null references project(id)
);

create or replace procedure add_category_to_project(
    username_in varchar(20),
    category_in varchar(50),
    project_id_in int
)
language plpgsql
as $$
    BEGIN
        insert into project_category (title, account_id)
        select category_in, (select id from account where username=username_in)
        where not exists(
            select 1 from project_category where title=category_in and account_id=
                                                              (select id from account where username=username_in)
        );

        insert into project_category_link (category_id, project_id)
        values ((select id from project_category where title=category_in),
                project_id_in
               );
    end;$$;

create or replace procedure delete_project(
    project_id_in int
)
language plpgsql
as $$BEGIN
    delete from project_category_link
    where project_id=project_id_in;

    delete from deliverable
    where project_id=project_id_in;

    delete from project_wiki_link
    where project_id=project_id_in;

    delete from project
    where id=project_id_in;
end;
$$;


select * from project;
call add_category_to_project('test', 'some', 1);
select * from project_category;

select c.title as category, p.title as project
from project_category c
inner join project_category_link pcl on c.id = pcl.category_id
inner join project p on p.id = pcl.project_id;

select *
from project
         inner join project_category_link pcl on project.id = pcl.project_id
where pcl.category_id = (select id from project_category where title='WikiApp')
and project.account_id=(select id from account where username='test');





-- where pcl.project_id=(select id
--                       from project
--                       where title='WikiApp'
--                         and account_id=
--                             (select id
--                              from account
--                              where username='test'));

create table project_wiki_link(
    id serial primary key,
    project_id int not null references project (id),
    wiki_id int not null references wiki(id)
);

drop table project;

-- alter table project
-- drop column wiki_page;

create table project_link (
    id serial primary key,
    project_parent_id int not null references project(id),
    project_child_id int not null references project(id),
    constraint u_parent_child unique (project_child_id, project_parent_id)
);

alter table project
add column created_on timestamptz default now();

alter table project
add column account_id int not null references account(id);