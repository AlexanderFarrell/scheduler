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
                         created_on timestamptz default now(),
                         parent_id int references project(id),
                         category_id int references project_category(id)
--     wiki_page int references wiki(id)
--     notes text not null default ''
);

alter table project
add column description text not null default '';

create table analysis (
    id serial primary key,
    maintenance size

);

alter table project
add column created_on  timestamptz not null default now();

alter table project
add column category varchar(30);

update project p
set category=(select c.title
              from project_category c
              inner join project_category_link pcl on c.id = pcl.category_id
              where pcl.project_id = p.id);

select * from project;

select * from project;

select * from project p
    inner join project_category c on p.category_id = c.id;

alter table project
add column parent_id int references project(id);

alter table project
    add column category_id int references project_category(id);

update project p
set category_id=(select pcl.category_id
                 from project_category_link pcl
              where pcl.project_id = p.id);

alter table project
drop column category;

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