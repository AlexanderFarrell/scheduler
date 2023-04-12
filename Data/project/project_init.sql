create  type Status as enum (
    'Not Started',
    'In Development',
    'Completed',
    'On-Going',
    'Retired'
    );

alter type status add value 'On Hold' after 'In Development';

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
                         account_id int not null references account(id),
                         created_on timestamptz default now()

--     wiki_page int references wiki(id)
--     notes text not null default ''
);

alter table project
add column created_on  timestamptz not null default now();


select * from project;

alter table project
add column parent_id int references project(id);

create table deliverable (
                             id serial primary key,
                             title varchar(150) not null,
                             created_on timestamptz not null default now(),
                             completed timestamptz,
                             project_id int not null references project(id)
);



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