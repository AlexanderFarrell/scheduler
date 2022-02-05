create table goal (
    id serial primary key,
    title text not null,
    item_id int not null unique references item(id),
    date date not null
);

alter table goal
add column is_complete bool not null default false;

create table plan (
    id serial primary key,
    title text not null,
    goal_id int references goal(id),
    item_id int not null unique references item(id),
    date date not null,
    time time not null
);

create table info_log (

);

create procedure add_goal(title_in text, date_in date, username_in varchar(20))
    language plpgsql as
$$
declare
    item_id int;
BEGIN
    insert into item (account_id, type_id) VALUES
        ((select id from account where username=username_in),
         'goal')
    returning id into item_id;

    insert into goal (title, date, item_id) VALUES
        (title_in, date_in, item_id);

end;
$$;