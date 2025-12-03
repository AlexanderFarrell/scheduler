create table goal (
    id serial primary key,
    title varchar(100) not null,
    status int not null default 0,
    max int not null default 1,
    account_id int not null references account(id)
);

create table daily_goal(
    id serial primary key,
    day date not null default now(),
    goal_id int not null references goal(id)
);

create table weekly_goal(
    id serial primary key,
    week int not null default date_part('week', now()),
    year int not null default date_part('year', now()),
    goal_id int not null references goal(id)
);

create or replace procedure add_daily_goal(
    title_in varchar(100),
    status_in int,
    max_in int,
    day_in date,
    username_in  varchar(100))
language plpgsql
as $$
    declare goal_id_in int;
    BEGIN

    insert into goal (title, status, max, account_id)
    values (title_in, status_in, max_in, (select id from account where username=username_in))
    returning id into goal_id_in;

    insert into daily_goal (day, goal_id) VALUES (day_in, goal_id_in);

    end;$$;

create or replace procedure add_weekly_goal(
    title_in varchar(100),
    status_in int,
    max_in int,
    week_in int,
    year_in int,
    username_in varchar(100))
language plpgsql
as $$
    declare goal_id_in int;
    BEGIN

    insert into goal (title, status, max, account_id)
    values (title_in, status_in, max_in, (select id from account where username=username_in))
    returning id into goal_id_in;

    insert into weekly_goal (week, year, goal_id) VALUES (week_in, year_in, goal_id_in);

    end;$$;

create or replace view daily_goals as
    select goal.id as goal_id,
           title,
           status,
           max,
           account_id,
           dg.id as daily_goal_id,
           day
    from goal
    inner join daily_goal dg on goal.id = dg.goal_id;

create or replace view weekly_goals as
    select goal.id as goal_id,
           title,
           status,
           max,
           week,
           year,
           account_id,
           wg.id as weekly_goal_id
    from goal
    inner join weekly_goal wg on goal.id = wg.goal_id;

-- select * from daily_goals;
-- call add_daily_goal('Take Out Trash', 0, 1, date(now()), 'AlexanderFarrell');

-- select * from weekly_goals;
-- call add_weekly_goal('Take Out Trash', 0, 1, date_part('week', now())::integer, date_part('year', now())::integer, 'AlexanderFarrell');