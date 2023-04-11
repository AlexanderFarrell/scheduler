select *
from deliverable
inner join project p on p.id = deliverable.project_id
order by priority desc;

select *
from deliverable
where date(completed)=current_date;



select p.title as project,
       c.title as category,
       time,
       status,
       maintenance,
       priority
from project p
inner join project_category_link pcl on p.id = pcl.project_id
inner join project_category c on c.id = pcl.category_id
where p.account_id=11
order by priority desc;


select p.title as project,
       c.title as category,
       time,
       status,
       maintenance,
       priority
from project p
            inner join project_category_link pcl on p.id = pcl.project_id
            inner join project_category c on c.id = pcl.category_id
where p.account_id=(select id from account where username='AlexanderFarrell')
  and p.priority>=0
order by p.priority desc;