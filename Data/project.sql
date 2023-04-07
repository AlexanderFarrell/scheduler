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

create view


create table project_wiki_link(
    id serial primary key,
    project_id int not null references project (id),
    wiki_id int not null references wiki(id)
);

drop table project;

alter table project
drop column wiki_page;

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