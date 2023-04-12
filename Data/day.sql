-- Gets all the Deliverables completed on a specific day
select d.title as deliverable,
       p.title as project,
       p.priority
from deliverable d
inner join project p on p.id = d.project_id
where date(d.completed) = '2023-04-10';


-- Gets a score of deliverables completed based on priority of the project
select sum(p.priority) as score
from deliverable d
         inner join project p on p.id = d.project_id
where date(d.completed) = '2023-04-10';


-- Word given on a specific day.
select w.title,
       w.content
from words w
where w.date = '2023-04-10';

select count(d.completed), date(d.completed)
from deliverable d
group by date(d.completed);

select sum(p.priority) as score, date(d.completed)
from deliverable d
         inner join project p on p.id = d.project_id
    where d.completed is not null
group by date(d.completed)
order by date(d.completed);

select sum(p.priority) as score,
       count(d.completed) as count,
       date(d.completed) as date,
       pc.title as category
from deliverable d
         inner join project p on p.id = d.project_id
right join project_category_link pcl on p.id = pcl.project_id
right join project_category pc on pc.id = pcl.category_id
-- where pc.title='Education'
    and d.completed is not null
group by pc.title, date(d.completed)
order by date(d.completed), pc.title;

select p.title, date(created_on)
from project p
order by date(created_on);

select count(title)
from project p
group by date(created_on)
order by date(created_on);