

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


create table project_news(
    id serial primary key,
    title varchar(200) not null,
    content text,
    date date not null,
    project_id int not null references project(id)
);


-- where pcl.project_id=(select id
--                       from Project
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

-- alter table Project
-- drop column wiki_page;

create table project_link (
    id serial primary key,
    project_parent_id int not null references project(id),
    project_child_id int not null references project(id),
    constraint u_parent_child unique (project_child_id, project_parent_id)
);

create view scorecard_day as
select sum(p.priority) as score,
       count(d.completed) as completed_count,
       date(d.completed) as date
from deliverable d
         inner join project p on p.id = d.project_id
where d.completed is not null
group by date(d.completed)
order by date(d.completed) desc;

create view scorecard_category as
select sum(p.priority) as score,
       count(d.completed) as count,
       date(d.completed) as date,
       pc.title as category
from deliverable d
         inner join project p on p.id = d.project_id
         inner join project_category pc on pc.id = p.category_id
-- where pc.title='Education'
    where d.completed is not null
group by pc.title, date(d.completed)
order by date(d.completed), pc.title;

drop view scorecard_day;

select * from scorecard_day;
select * from scorecard_category;




select sum(p.priority) as score,
       count(d.completed) as count,
--        date(d.completed) as date,
       pc.title as category
from deliverable d
         inner join project p on p.id = d.project_id
         inner join project_category pc on pc.id = p.category_id
-- where pc.title='Education'
where d.completed is not null
group by pc.title
-- group by pc.title, date(d.completed)
order by pc.title;