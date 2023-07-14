create table stakeholder
(
    id serial primary key,
    name varchar(100) not null,
    description text,
    account_id  integer not null references account(id)
);

create table stakeholder_project_link
(
    id serial primary key,
    stakeholder_id int not null references stakeholder(id),
    project_id int not null references project(id),
    constraint uq_stakeholder_project unique (stakeholder_id, project_id)
);

create table stakeholder_wiki_link
(
    id serial primary key,
    stakeholder_id int not null references stakeholder(id),
    wiki_id int not null references wiki(id),
    constraint uq_stakeholder_wiki unique (stakeholder_id, wiki_id)
);

create table stakeholder_tag
(
    id serial primary key,
    tag varchar(15) not null,
    stakeholder_id int not null references stakeholder(id)
);

create table requirement
(
    id serial primary key,
    description varchar(150) not null,
    stakeholder_id int not null references stakeholder(id)
);

alter table stakeholder
add column priority int not null default 0;