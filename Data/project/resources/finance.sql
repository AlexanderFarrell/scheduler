create table customer (
                          id serial primary key,
                          name varchar(100) not null,
                          description text,
                          account_id int not null references account(id)
);

create table payment (
    id serial primary key,
    amount numeric(10, 2) not null ,
    description varchar(100) not null ,
    account_id int not null references account(id),
    stakeholder_id int not null references stakeholder (id),
    date_time timestamptz not null
);

create or replace procedure add_payment(
    amount_in numeric(10,2),
    customer_in varchar(100),
    date_time_in timestamptz,
    description_in varchar(100),
    username_in varchar(30)
    )
language plpgsql
as $$
BEGIN
    insert into stakeholder (name, account_id)
    select customer_in, (select id from account where username=username_in)
    where not exists(
        select 1 from stakeholder where name=customer_in and account_id=
                                                                   (select id from account where username=username_in)
    );

    insert into payment (amount, description, account_id, stakeholder_id, date_time)
    values (
            amount_in,
            description_in,
            (select id from account where username=username_in),
            (select id from stakeholder where name=customer_in),
            date_time_in
           );
END;
$$;

select * from account;

call add_payment(50.00, 'Amy', now(), 'Tutoring', 'TestAlex');

select * from payment;

create or replace view revenue_by_customer as
select c.name as customer,
       sum(p.amount) as revenue,
       c.account_id as account_id
from stakeholder c
inner join payment p on c.id = p.stakeholder_id
group by c.name, c.account_id;

create or replace view revenue_by_date as
select date(p.date_time) as date,
       sum(p.amount) as revenue,
       p.account_id as account_id
from payment p
group by date(p.date_time), p.account_id;

select name, amount, date(date_time) from payment
inner join stakeholder c on c.id = payment.stakeholder_id
order by date(date_time) desc;

select * from revenue_by_date
order by date;

select * from revenue_by_customer
    order by revenue
desc ;

drop view revenue_by_month;

create or replace view revenue_by_month as
    select extract(month from date) as month,
           extract(year from date) as year,
           sum(revenue),
            account_id
        from revenue_by_date
            group by extract(month from date), extract(year from date), account_id;

create or replace view revenue_by_year as
    select extract(year from date) as year,
           sum(revenue),
            account_id
        from revenue_by_date
            group by extract(year from date), account_id;

create or replace view revenue_by_week as
    select extract(week from date) % 52 as week,
           extract(year from date) as year,
           sum(revenue) as revenue,
            account_id
        from revenue_by_date
            group by extract(week from date), extract(year from date), account_id;

alter table payment
add column entered_on timestamptz not null default now();

select * from revenue_by_month
order by month, year;

select * from revenue_by_year;


select * from payment;

