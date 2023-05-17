create table tracker_topic (
    id serial primary key,
    name varchar(100) not null,
    account_id int not null references account(id)
);

create table tracker_item (
    id serial primary key,
    topic_id int not null references tracker_topic(id),
    value int not null
);









select date(days.day) as date,
       count(daily_goals.title) as set_goals,
       sum(
           case
                when daily_goals.status = daily_goals.max and daily_goals.status is not null then 1
                else 0
           end
           ) as completed_goals,
        case when count(daily_goals.max ) =0 then 0
            else
        avg(daily_goals.status/daily_goals.max)
        end as completion
from (SELECT generate_series('2023-05-01'::date, '2023-05-31'::date, '1 day') AS day) as days
left join daily_goals on daily_goals.day = days.day
group by days.day
order by days.day;

select extract(month from generate_series('2023-01-01'::date, '2023-12-31'::date, '1 month')) as months;

select generate_series(1, 100);