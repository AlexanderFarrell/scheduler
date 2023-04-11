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