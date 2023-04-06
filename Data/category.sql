create table category (
    id serial primary key,
    title varchar(60) not null
);

create table category_link(
    id serial primary key,
    category_parent_id int not null references category(id),
    category_child_id int not null references category(id),
    constraint u_category_parent_child unique (category_child_id, category_parent_id)
);

create table category_project_link(
    id serial primary key,
    category_id int not null references category(id),
    project_id int not null references project(id),
    constraint u_category_project unique (category_id, project_id)
);

select w.title
from wiki w
inner join project_wiki_link pwl on w.id = pwl.wiki_id
where pwl.project_id=1;