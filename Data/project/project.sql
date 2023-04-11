

update words
    set account_id=11;

select * from words;

alter table words
add column account_id int references account(id);

select * from wiki;

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

